import { Field } from '../types';
import Emitter from '../Emitter';

export default class Fields extends Emitter {
  #fields = [];
  #builder = null;

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
  }

  has (type) {
    return this.#fields.some(Field.FIND_PREDICATE(type));
  }

  get (type) {
    return this.#fields.find(Field.FIND_PREDICATE(type));
  }

  add (field) {
    field = new Field(field);

    const existing = this.get(field.type);

    if (existing) {
      this.#builder.logger.log(
        'Field definition already exists field, updating.',
        'Old:', existing,
        'New:', field,
      );

      const index = this.#fields.indexOf(existing);
      this.#fields[index] = field;
      this.emit('fields.update', this, field);
    } else {
      this.#fields.push(field);
      this.emit('fields.add', this, field);
    }
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

  all () {
    return this.#fields;
  }
}
