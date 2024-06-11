import type { FieldObject } from '../types';
import { Field } from '../classes';
import Emitter from '../Emitter';
import Builder from '../Builder';

export declare abstract class IFields {
  constructor(options?: { builder: Builder });

  /** Checkes if a field exists */
  has(type: string): boolean;

  /** Get a field by its type */
  get(type: string): Field;

  /** Add a new field definition */
  add(field: FieldObject | Field): Field;

  /** Remove a field definition */
  remove(type: string): void;

  /** Get all fields */
  all(): Array<Field>;
}

export default class Fields extends Emitter implements IFields {
  #fields: Field[] = [];
  #builder: Builder = null;

  field: object;

  constructor ({ builder }: { builder?: Builder} = {}) {
    super();

    this.#builder = builder;
  }

  has (type: string): boolean {
    return this.#fields.some(Field.FIND_PREDICATE(type));
  }

  get (type: string) {
    return this.#fields.find(Field.FIND_PREDICATE(type));
  }

  add (field: FieldObject) {
    const field_ = new Field(field);

    const existing = this.get(field_.type);

    if (existing) {
      this.#builder.logger.log(
        'Field definition already exists, updating.',
        'Old:', existing,
        'New:', field,
      );

      const index = this.#fields.indexOf(existing);
      this.#fields[index] = field_;
      this.emit('fields.update', this, field);
    } else {
      this.#fields.push(field_);
      this.emit('fields.add', this, field);
    }

    return field_;
  }

  remove (type: string) {
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
