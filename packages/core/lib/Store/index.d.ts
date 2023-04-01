import {
  Component,
  ComponentOverride,
  ComponentSettingsFieldKeyTuple,
  ElementId,
  ElementObject,
} from '../types';
import { Builder } from '../Builder';
import { Emitter } from '../Emitter';

export declare interface StoreSanitizeOptions {
  component?: Component;
  override?: ComponentOverride;
  resetIds?: boolean;
}

export declare interface StoreFindOptions {
  parent?: Array<ElementObject>;
}

export declare type StoreFindDeepOptions = Partial<StoreFindOptions & {
  deep?: boolean;
}>;

export declare class Store extends Emitter {
  constructor(options?: { builder: Builder });

  /**
   * Check if an element id is valid.
   * An Element ID is a string or a number, and cannot be empty.
   */
  isIdValid(id: string | number): boolean;

  /** Check if two element ids are the same */
  isSameElement(elementId: ElementId, siblingId: ElementId): boolean;

  /** Get the content of the store */
  get(): Array<ElementObject>;

  /**
   * Set the content of the store.
   * If the emit option is set to false, the store will not emit a change event.
   */
  set(content: Array<ElementObject>, options?: { emit?: boolean }): void;

  /**
   * Sanitize an element object (adds missing properties, ids, etc.)
   * If the resetIds option is set to true, the element id will be reset even
   * if it already exists.
   */
  sanitize(
    element: ElementObject,
    options?: StoreSanitizeOptions
  ): ElementObject;

  /** Creates a new element object based on an existing component (or not) */
  createElement(type: string, options?: Partial<{
    baseElement?: ElementObject;
  } & StoreSanitizeOptions>): ElementObject;

  /** Adds an element to the store */
  addElement(element: ElementObject, options?: Partial<{
    position?: 'before' | 'after';
  } & StoreFindOptions & StoreSanitizeOptions>): ElementObject;

  /** Finds an element in the store */
  getElement(id: ElementId, options?: StoreFindDeepOptions): ElementObject;

  /** Removes an element from the the store */
  removeElement(id: ElementId, options?: StoreFindDeepOptions): boolean;

  /** Updates an element in the store with new props */
  setElement(
    id: ElementId,
    newContent: object,
    options?: StoreFindDeepOptions
  ): ElementObject;

  /** Moves an element next to a sibling (inside the same parent or not) */
  moveElement(
    element: ElementObject,
    sibling: ElementObject,
    options?: Partial<StoreFindOptions & {
      position?: 'before' | 'after';
    }>
  ): ElementObject;

  /** Duplicate an element */
  duplicateElement(
    element: ElementObject,
    options?: StoreFindOptions
  ): ElementObject;

  /** Recursively finds the nearest parent of an element */
  findNearestParent(
    id: ElementId,
    options?: StoreFindOptions
  ): Array<ElementObject>;

  /** Recursively checks if an element is inside a parent */
  contains(id: ElementId, options?: StoreFindOptions): boolean;

  /** Retrieves the setting value of an element */
  getElementSettings(
    element: ElementObject,
    key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>,
    def?: any
  ): any;

  /** Sets the setting value of an element */
  setElementSettings(
    element: ElementObject,
    key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>,
    value: any
  ): void;

  /** Commit changes into history */
  commit(): void;

  /** Undo the last change */
  undo(): void;

  /** Redo the last change */
  redo(): void;

  canUndo(): boolean;
  canRedo(): boolean;
}
