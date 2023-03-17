import { v4 as uuid } from 'uuid';

import Emitter from '../Emitter';

export default class Store extends Emitter {
  #content = [];
  #builder = null;

  constructor ({ builder }) {
    super();

    this.#builder = builder;
  }

  set (content) {
    this.#content = content.map(e => this.sanitize(e));
    this.emit('content.update', this.#content);
  }

  sanitize (element) {
    if (!element.id) {
      element.id = uuid();
    }

    const component = this.#builder.getComponent(element.type);
    const override = this.#builder.getOverride('component', element.type);

    // const deserialize = overrides?.deserialize || component?.deserialize;

    // if (deserialize) {
    //   Object.assign(elmt, deserialize(elmt));
    // }

    return override?.sanitize
      ? override.sanitize(this.sanitize.bind(this), element)
      : component?.sanitize
        ? component.sanitize(this.sanitize.bind(this), element)
        : element;
  }

  addElement (element, {
    parent = this.#content,
    position = 'after',
  } = {}) {
    element = this.sanitize(element);

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

    const index = parent.findIndex(elmt => elmt.id === element.id);

    if (index > -1) {
      parent.splice(index, 1);
      this.emit('content.update', this.#content);
    }
  }
}
