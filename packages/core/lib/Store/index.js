import { exists, get, set, cloneDeep } from '@junipero/core';

import Emitter from '../Emitter';

export default class Store extends Emitter {
  #content = [];
  #history = [];
  #historyIndex = 0;
  #builder = null;

  constructor ({ builder }) {
    super();

    this.#builder = builder;
  }

  isIdValid (id) {
    return exists(id) && id !== '';
  }

  isSameElement (elementId, siblingId) {
    return this.isIdValid(elementId) && this.isIdValid(siblingId) &&
      elementId === siblingId;
  }

  get () {
    return this.#content;
  }

  set (content, { emit = true } = {}) {
    this.#content = (Array.isArray(content) ? content : [])
      .map(e => this.sanitize(e, { withDefaults: true }));

    emit && this.emit('content.update', this.#content);
    this.commit();
  }

  sanitize (element, {
    component: c,
    override: o,
    ...opts
  } = {}) {
    if (!this.isIdValid(element.id) || opts.resetIds) {
      element.id = this.#builder.generateId();
    }

    const component = c || this.#builder.getComponent(element.type);
    const override = o || this.#builder.getOverride('component', element.type);

    if (opts.withDefaults) {
      element = {
        ...(override?.construct || component?.construct)?.({
          builder: this.#builder,
        }) || {},
        ...element,
      };
    }

    const deserialize = override?.deserialize || component?.deserialize;
    element = deserialize?.(element, { builder: this.#builder }) || element;

    const customSanitize = override?.sanitize || component?.sanitize;
    element = customSanitize?.(element, { builder: this.#builder }) || element;

    const containers = override?.getContainers?.(element) ||
      component?.getContainers?.(element) ||
      [element.content];

    containers.forEach(container => {
      if (Array.isArray(container)) {
        container.forEach((elmt, i) => {
          container[i] = this.sanitize(elmt, opts);
        });
      }
    });

    return element;
  }

  createElement (type, {
    component: c,
    override: o,
    baseElement,
    ...opts
  } = {}) {
    const component = c || this.#builder.getComponent(type);
    const override = o || this.#builder.getOverride('component', component.id);
    baseElement = {
      ...baseElement,
      ...component.construct?.({
        builder: this.#builder,
      }) || {},
    };
    const elementWithContent = {
      ...baseElement,
      content: typeof baseElement.content === 'function'
        ? baseElement.content(this.#builder.getText.bind(this.#builder))
        : baseElement.content,
    };

    const element = {
      ...elementWithContent,
      ...(override?.construct?.({
        builder: this.#builder,
        baseElement: elementWithContent,
      }) || {}),
    };

    return this.sanitize(element, { component: c, override: o, ...opts });
  }

  addElement (element, {
    parent = this.#content,
    position = 'after',
    component,
    ...opts
  } = {}) {
    this.#builder.logger.log('Adding element:', element, { parent, position });

    // If component is provided, we construct the element from it
    // Otherwise, we just sanitize it
    element = component
      ? this.createElement(component.id, { component, ...opts })
      : this.sanitize(element, opts);

    switch (position) {
      case 'before':
        parent.unshift(element);
        break;
      case 'after':
        parent.push(element);
        break;
    }

    this.commit();
    this.emit('content.update', this.#content);

    return element;
  }

  getElement (id, { parent = this.#content, deep = false } = {}) {
    if (!this.isIdValid(id)) {
      return;
    }

    const found = parent.find(elmt => this.isSameElement(elmt?.id, id));

    if (found) {
      return found;
    }

    if (deep) {
      for (const child of parent) {
        const component = this.#builder.getComponent(child.type);
        const override = this.#builder.getOverride('component', child.type);
        const containers = override?.getContainers?.(child) ||
          component?.getContainers?.(child) ||
          [child.content];

        for (const container of containers) {
          const found = this.getElement(id, { parent: container, deep });

          if (found) {
            return found;
          }
        }
      }
    }
  }

  removeElement (id, { parent = this.#content, deep } = {}) {
    if (!this.isIdValid(id)) {
      return;
    }

    const index = parent.findIndex(elmt => this.isSameElement(elmt?.id, id));

    if (index > -1) {
      parent.splice(index, 1);
      this.commit();
      this.emit('content.update', this.#content);

      return true;
    }

    if (deep) {
      for (const child of parent) {
        const component = this.#builder.getComponent(child.type);
        const override = this.#builder.getOverride('component', child.type);
        const containers = override?.getContainers?.(child) ||
          component?.getContainers?.(child) ||
          [child.content];

        for (const container of containers) {
          const removed = this.removeElement(id, { parent: container, deep });

          if (removed) {
            return true;
          }
        }
      }
    }

    return false;
  }

  setElement (id, newContent, {
    element: e,
    parent = this.#content,
    deep,
  } = {}) {
    if (!this.isIdValid(id)) {
      return;
    }

    const element = e || this.getElement(id, { parent, deep });
    const component = this.#builder.getComponent(element.type);
    const override = this.#builder.getOverride('component', element.type);

    const serialize = override?.serialize || component?.serialize;

    Object.assign(
      element,
      serialize?.(newContent, { builder: this.#builder }) ||
        newContent || {}
    );

    this.commit();
    this.emit('content.update', this.#content);

    return element;
  }

  moveElement (element, sibling, { parent = this.#content, position } = {}) {
    if (
      this.isSameElement(element?.id, sibling?.id) ||
      this.contains(sibling.id, { parent: element })
    ) {
      return;
    }

    const nearestParent = this.findNearestParent(element.id);
    const childIndex = nearestParent
      ?.findIndex(e => this.isSameElement(e?.id, element.id));
    const [retrievedElement] = nearestParent?.splice(childIndex, 1) || [];

    if (!retrievedElement) {
      return;
    }

    const newChildIndex = parent.indexOf(sibling);
    parent.splice(
      position === 'after' ? newChildIndex + 1 : newChildIndex,
      0,
      retrievedElement
    );

    this.commit();
    this.emit('content.update', this.#content);

    return retrievedElement;
  }

  duplicateElement (element, { parent = this.#content } = {}) {
    let newElmt = this.sanitize(cloneDeep(element), { resetIds: true });
    const component = this.#builder.getComponent(element.type);
    const override = this.#builder.getOverride('component', element.type);
    const duplicate = override?.duplicate || component?.duplicate;

    if (typeof duplicate === 'function') {
      newElmt = duplicate(newElmt);
    }

    parent.splice(
      parent.findIndex(e => this.isSameElement(e.id, element.id)) + 1,
      0,
      newElmt
    );

    this.commit();
    this.emit('content.update', this.#content);

    return newElmt;
  }

  findNearestParent (id, { parent = this.#content } = {}) {
    // First check if element in inside direct parent to avoid trying to
    // find every component & override for every nested level
    for (const e of parent) {
      if (this.isSameElement(e.id, id)) {
        return parent;
      }
    }

    // Then try to find the element inside nested containers
    // Row component for exemple doesn't have a content property and uses
    // the getContainers component method to return the nested columns
    // (using the cols property)
    for (const e of parent) {
      const component = this.#builder.getComponent(e.type);
      const override = this.#builder.getOverride('component', e.type);

      const containers = override?.getContainers?.(e) ||
        component?.getContainers?.(e) ||
        [e.content];

      for (const container of containers) {
        if (Array.isArray(container)) {
          const nearest = this.findNearestParent(id, {
            parent: container,
          });

          if (nearest) {
            return nearest;
          }
        }
      }
    }

    return null;
  }

  contains (id, { parent = this.#content } = {}) {
    // Force parent to be an array to be able to loop over it
    // -----
    // In some cases (Store.moveElement for example), parent cannot be
    // `element.content` because it would prevent rows (with `element.cols`)
    // or other container-based elements from being checked by `contains`
    parent = [].concat(parent);

    for (const e of parent) {
      if (this.isSameElement(e?.id, id)) {
        return true;
      }
    }

    for (const e of parent) {
      const component = this.#builder.getComponent(e.type);
      const override = this.#builder.getOverride('component', e.type);

      const containers = override?.getContainers?.(e) ||
        component?.getContainers?.(e) ||
        [e.content];

      for (const container of containers) {
        if (Array.isArray(container)) {
          if (this.contains(id, { parent: container })) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // This allows 4 signatures:
  // (element, 'settings.size')
  // (element, { from: 'size', to: 'settings.size' })
  // (element, [{ from: 'size', to: 'settings.size' }])
  // (element, ['settings.size', 'settings.url'])
  getElementSettings (element, key, def) {
    if (Array.isArray(key)) {
      return key.reduce((res, k) => {
        res[k?.to || k] = get(element, k?.from || k, k?.default ?? def);

        return res;
      }, {});
    } else {
      return get(element, key?.from || key, key?.default ?? def);
    }
  }

  // This allows 4 signatures:
  // (element, 'settings.size', 20)
  // (element, { from: 'size', to: 'settings.size' }, { size: 20 })
  // (element, [{ from: 'size', to: 'settings.size' }], { size: 20 })
  // (element, ['size', 'url'], { size: 20, url: '...' })
  setElementSettings (element, key, value) {
    if (Array.isArray(key)) {
      key.forEach(k =>
        set(element, k.to || k, get(value, k.from || k, k.default)));
    } else {
      set(
        element,
        key?.to || key,
        key?.from ? get(value, key.from, key?.default) : value ?? key?.default
      );
    }

    return element;
  }

  commit () {
    if (this.#historyIndex > 0) {
      this.#history = this.#history.slice(this.#historyIndex);
    }

    this.#historyIndex = 0;
    this.#history.unshift(cloneDeep(this.#content));
    this.#history = this.#history.slice(0, this.#builder.options.historyLimit);
    this.emit('history.commit', this.#history, this.#historyIndex);
  }

  canUndo () {
    return this.#historyIndex < this.#history.length - 1;
  }

  canRedo () {
    return this.#historyIndex > 0;
  }

  undo () {
    if (!this.canUndo()) {
      return;
    }

    this.#historyIndex++;
    this.#content = cloneDeep(this.#history[this.#historyIndex]);
    this.emit('history.undo', this.#history, this.#historyIndex);
    this.emit('content.update', this.#content);
  }

  redo () {
    if (!this.canRedo()) {
      return;
    }

    this.#historyIndex--;
    this.#content = cloneDeep(this.#history[this.#historyIndex]);
    this.emit('history.redo', this.#history, this.#historyIndex);
    this.emit('content.update', this.#content);
  }

  resetHistory () {
    this.#history = [];
    this.#historyIndex = 0;
    this.emit('history.reset', this.#history, this.#historyIndex);
  }
}
