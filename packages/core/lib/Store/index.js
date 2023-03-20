import Emitter from '../Emitter';

export default class Store extends Emitter {
  #content = [];
  #builder = null;

  constructor ({ builder }) {
    super();

    this.#builder = builder;
  }

  get () {
    return this.#content;
  }

  set (content) {
    this.#content = content.map(e => this.sanitize(e));
    this.emit('content.update', this.#content);
  }

  sanitize (element, opts = {}) {
    if (!element.id || opts.resetIds) {
      element.id = this.#builder.generateId();
    }

    const component = this.#builder.getComponent(element.type);
    const override = this.#builder.getOverride('component', element.type);

    const deserialize = override?.deserialize || component?.deserialize;
    element = deserialize?.(element) || element;

    const customSanitize = override?.sanitize || component?.sanitize;
    element = customSanitize?.(element) || element;

    const containers = override?.getContainers?.(element) ||
      component?.getContainers?.(element) ||
      [element.content];

    containers.forEach(container => {
      if (Array.isArray(container)) {
        container.forEach(elmt => this.sanitize(elmt, opts));
      }
    });

    return element;
  }

  addElement (element, {
    parent = this.#content,
    position = 'after',
    ...opts
  } = {}) {
    this.#builder.logger.log('Adding element:', element, { parent, position });
    element = this.sanitize(element, opts);

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
      const component = this.#builder.getComponent(element.type);
      const override = this.#builder.getOverride('component', element.type);

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
    for (const e of parent) {
      if (this.isElement(e, element)) {
        return true;
      }
    }

    for (const e of parent) {
      const component = this.#builder.getComponent(element.type);
      const override = this.#builder.getOverride('component', element.type);

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
