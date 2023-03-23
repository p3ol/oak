import { cloneDeep } from '@junipero/core';

import Emitter from '../Emitter';

export default class Store extends Emitter {
  #content = [];
  #builder = null;

  constructor ({ builder }) {
    super();

    this.#builder = builder;
  }

  isElement (element, sibling) {
    return element && sibling && element.id === sibling.id;
  }

  get () {
    return this.#content;
  }

  set (content) {
    this.#content = content
      .map(e => this.sanitize(e, { withDefaults: true }));
    this.emit('content.update', this.#content);
  }

  sanitize (element, {
    component: c,
    override: o,
    ...opts
  } = {}) {
    if (!element.id || opts.resetIds) {
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

    this.emit('content.update', this.#content);
  }

  removeElement (element, { parent = this.#content } = {}) {
    if (!element.id) {
      return;
    }

    const index = parent.findIndex(elmt => this.isElement(elmt, element));

    if (index > -1) {
      parent.splice(index, 1);
      this.emit('content.update', this.#content);
    }
  }

  setElement (element, newContent) {
    Object.assign(element, newContent);
    this.emit('content.update', this.#content);
  }

  moveElement (element, sibling, { parent = this.#content, position } = {}) {
    if (
      !element.id ||
      !sibling.id ||
      this.isElement(element, sibling) ||
      this.contains(sibling, { parent: element })
    ) {
      return;
    }

    const nearestParent = this.findNearestParent(element);
    const childIndex = nearestParent
      ?.findIndex(e => this.isElement(e, element));
    nearestParent?.splice(childIndex, 1);

    const newChildIndex = parent.indexOf(sibling);
    parent.splice(
      position === 'after' ? newChildIndex + 1 : newChildIndex,
      0,
      element
    );

    this.emit('content.update', this.#content);
  }

  duplicateElement (elmt, { parent = this.#content } = {}) {
    let newElmt = this.sanitize(cloneDeep(elmt), { resetIds: true });
    const component = this.#builder.getComponent(elmt.type);
    const override = this.#builder.getOverride('component', elmt.type);
    const duplicate = override?.duplicate || component?.duplicate;

    if (typeof duplicate === 'function') {
      newElmt = duplicate(newElmt);
    }

    parent.splice(
      parent.findIndex(e => e.id === elmt.id) + 1,
      0,
      newElmt
    );

    this.emit('content.update', this.#content);
  }

  findNearestParent (element, { parent = this.#content } = {}) {
    // First check if element in inside direct parent to avoid trying to
    // find every component & override for every nested level
    for (const e of parent) {
      if (this.isElement(e, element)) {
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
          const nearest = this.findNearestParent(element, {
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

  contains (element, { parent = this.#content } = {}) {
    // Force parent to be an array to be able to loop over it
    // -----
    // In some cases (Store.moveElement for example), parent cannot be
    // `element.content` because it would prevent rows (with `element.cols`)
    // or other container-based elements from being checked by `contains`
    parent = [].concat(parent);

    for (const e of parent) {
      if (this.isElement(e, element)) {
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
          if (this.contains(element, { parent: container })) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
