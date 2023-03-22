import { Field } from '../types';
import Emitter from '../Emitter';

export default class Fields extends Emitter {
  #fields = [];

  has (type) {
    return this.#fields.some(Field.FIND_PREDICATE(type));
  }

  get (type) {
    return this.#fields.find(Field.FIND_PREDICATE(type));
  }

  add (field) {
    field = new Field(field);

    const found = this.#fields
      .findIndex(Field.FIND_PREDICATE(field.type));

    if (found > -1) {
      this.#fields[found] = field;
    } else {
      this.#fields.push(field);
    }

    this.emit('fields.add', this, field);
  }

  remove (type) {
    const index = this.#fields
      .findIndex(Field.FIND_PREDICATE(type));

    if (index > -1) {
      const field = this.#fields[index];
      this.#fields.splice(index, 1);
      this.emit('fields.remove', this, field);
    }
  }
}
