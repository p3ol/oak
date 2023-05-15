import { Field, FieldObject } from '../types';
import { Builder } from '../Builder';
import { Emitter } from '../Emitter';

export declare class Fields extends Emitter {
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
