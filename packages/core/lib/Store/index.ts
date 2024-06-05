import { exists, get, set, cloneDeep } from '@junipero/core';

import type {
  ComponentObject,
  ComponentOverrideObject,
  ComponentSettingsFieldKeyTuple,
  ElementId,
  ElementObject,
  ElementSettingsComplexKey,
  ElementSettingsKeyObject,
  StoreSanitizeOptions,
  StoreFindOptions,
  StoreFindDeepOptions,
} from '../types';
import {
  Component,
  ComponentOverride,
} from '../classes';
import Emitter from '../Emitter';
import Builder from '../Builder';

export declare abstract class IStore {
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
    component?: ComponentObject;
    override?: ComponentOverrideObject;
  } & StoreSanitizeOptions>): ElementObject;

  /** Adds an element to the store */
  addElement(element: ElementObject, options?: Partial<{
    position?: 'before' | 'after';
  } & StoreFindOptions & StoreSanitizeOptions>): ElementObject;

  /** Adds multiple elements to the store */
  addElements(elements: Array<ElementObject>, options?: Partial<{
    position?: 'before' | 'after';
  } & StoreFindOptions & StoreSanitizeOptions>): Array<ElementObject>;

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
  resetHistory(): void;
}

export default class Store extends Emitter implements IStore {
  #content: ElementObject[] = [];
  #history: ElementObject[] = [];
  #historyIndex: number = 0;
  #builder: Builder = null;

  constructor ({ builder }: { builder: Builder }) {
    super();

    this.#builder = builder;
  }

  isIdValid (id: ElementId) {
    return exists(id) && id !== '';
  }

  isSameElement (elementId: ElementId, siblingId: ElementId) {
    return this.isIdValid(elementId) && this.isIdValid(siblingId) &&
      elementId === siblingId;
  }

  get () {
    return this.#content;
  }

  set (content: Array<ElementObject>, { emit = true } = {}) {
    this.#content = (Array.isArray(content) ? content : [])
      .map(e => this.sanitize(e, { withDefaults: true }));

    emit && this.emit('content.update', this.#content);
    this.commit();
  }

  sanitize (element: ElementObject, {
    component: c,
    override: o,
    ...opts
  }: {
    component?: Component,
    override?: ComponentOverride,
    [_: string]: any
  } = {}) {
    if (!this.isIdValid(element.id) || opts.resetIds) {
      element.id = this.#builder.generateId();
    }

    const component = c || this.#builder.getComponent(element.type);
    const override = o || this.#builder.getOverride(
      'component', element.type
    ) as ComponentOverrideObject;
    const override_ = new ComponentOverride(
      override as ComponentOverrideObject
    );

    if (opts.withDefaults) {
      element = {
        ...(override_?.construct || component?.construct)?.({
          builder: this.#builder,
        }) || {},
        ...element,
      };
    }

    const deserialize = override_?.deserialize || component?.deserialize;
    element = deserialize?.(element, { builder: this.#builder }) || element;

    const customSanitize = override_?.sanitize || component?.sanitize;
    element = customSanitize?.(element, { builder: this.#builder }) || element;

    const containers = override_?.getContainers?.(element) ||
      component?.getContainers?.(element) ||
      [element.content];

    containers.forEach((container: ElementObject[]) => {
      if (Array.isArray(container)) {
        container.forEach((elmt, i) => {
          container[i] = this.sanitize(elmt, opts);
        });
      }
    });

    return element;
  }

  createElement (type: string, {
    component: c,
    override: o,
    baseElement,
    ...opts
  }: {
    component?: ComponentObject,
    override?: ComponentOverrideObject,
    baseElement?: ElementObject,
    [_: string]: any
  } = {}) {
    const component = c
      ? new Component(c) : new Component(this.#builder.getComponent(type));
    const override = o
      ? new ComponentOverride(o as ComponentOverrideObject)
      : this.#builder.getOverride(
        'component',
        component.id
      ) as ComponentOverride;
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

    return this.sanitize(element, { component, override, ...opts });
  }

  addElement (element: ElementObject, {
    parent = this.#content,
    position = 'after',
    component,
    ...opts
  }: {
    parent?: Array<ElementObject>,
    position?: 'before' | 'after',
    component?: ComponentObject,
    [_: string]: any
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

  addElements (elements: Array<ElementObject>, {
    parent = this.#content,
    position = 'after',
    ...opts
  } = {}) {
    this.#builder.logger
      .log('Adding elements:', elements, { parent, position });

    elements = elements.map(e => this.sanitize(e, opts));

    switch (position) {
      case 'before':
        parent.unshift(...elements);
        break;
      case 'after':
        parent.push(...elements);
        break;
    }

    this.commit();
    this.emit('content.update', this.#content);

    return elements;
  }

  getElement (
    id: string,
    { parent = this.#content, deep = false }: {
      deep?: boolean,
      parent?: ElementObject[]
    } = {}
  ): ElementObject {
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
        const containers: ElementObject[][] =
          (override as ComponentOverride)?.getContainers?.(child) ||
          component?.getContainers?.(child) ||
          [child.content as ElementObject[]];

        for (const container of containers) {
          const found = this.getElement(id, { parent: container, deep });

          if (found) {
            return found;
          }
        }
      }
    }
  }

  removeElement (
    id: string, {
      parent = this.#content,
      deep,
    }: {
      parent?: Array<ElementObject>,
      deep?: boolean
    } = {}) {
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
        const containers =
          (override as ComponentOverride)?.getContainers?.(child) ||
          component?.getContainers?.(child) ||
          [child.content as ElementObject[]];

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

  setElement (id: string, newContent: Partial<ElementObject>, {
    element: e,
    parent = this.#content,
    deep,
  }: {
    element?: ElementObject,
    parent?: Array<ElementObject>,
    deep?: boolean
  } = {}) {
    if (!this.isIdValid(id)) {
      return;
    }

    const element = e || this.getElement(id, { parent, deep });
    const component = this.#builder.getComponent(element.type);
    const override: ComponentOverride =
      this.#builder.getOverride('component', element.type) as ComponentOverride;

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

  moveElement (
    element?: ElementObject,
    sibling?: ElementObject,
    {
      parent = this.#content,
      position,
    }: {
      parent?: Array<ElementObject>,
      position?: 'before' | 'after'
    } = {}) {
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

  duplicateElement (element: ElementObject, { parent = this.#content } = {}) {
    let newElmt = this.sanitize(cloneDeep(element), { resetIds: true });
    const component = this.#builder.getComponent(element.type);
    const override: ComponentOverride =
      this.#builder.getOverride('component', element.type) as ComponentOverride;
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

  findNearestParent (
    id: string | ElementId, { parent = this.#content } = {}
  ): Array<ElementObject> {
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
      const override: ComponentOverride =
        this.#builder.getOverride('component', e.type) as ComponentOverride;

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

  contains (
    id: string | ElementId,
    { parent = this.#content }: { parent?: ElementObject | Array<any> } = {}
  ) {
    // Force parent to be an array to be able to loop over it
    // -----
    // In some cases (Store.moveElement for example), parent cannot be
    // `element.content` because it would prevent rows (with `element.cols`)
    // or other container-based elements from being checked by `contains`
    const parent_ = [].concat(parent);

    for (const e of parent_) {
      if (this.isSameElement(e?.id, id)) {
        return true;
      }
    }

    for (const e of parent_) {
      const component = this.#builder.getComponent(e.type);
      const override: ComponentOverride =
        this.#builder.getOverride('component', e.type) as ComponentOverride;

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
  getElementSettings (
    element: ElementObject,
    key: ElementSettingsKeyObject,
    def?: string
  ) {
    if (Array.isArray(key)) {
      return key.reduce((
        res: any,
        k: { from: string, to: string, default: string} | string
      ) => {
        res[(k as ElementSettingsComplexKey)?.to || k as string] =
          get(
            element,
            (k as ElementSettingsComplexKey)?.from || k as string,
            (k as ElementSettingsComplexKey)?.default ?? def as string
          );

        return res;
      }, {});
    } else {
      return get(
        element,
        (key as ElementSettingsComplexKey)?.from || key as string,
        (key as ElementSettingsComplexKey)?.default ?? def
      );
    }
  }

  // This allows 4 signatures:
  // (element, 'settings.size', 20)
  // (element, { from: 'size', to: 'settings.size' }, { size: 20 })
  // (element, [{ from: 'size', to: 'settings.size' }], { size: 20 })
  // (element, ['size', 'url'], { size: 20, url: '...' })
  setElementSettings (
    element: ElementObject,
    key: ElementSettingsKeyObject | string,
    value: any
  ) {
    if (Array.isArray(key)) {
      key.forEach(k =>
        set(
          element,
          (k as ElementSettingsComplexKey)?.to || k as string,
          get(value, (k as ElementSettingsComplexKey)?.from || k as string,
            (k as ElementSettingsComplexKey).default)
        )
      );
    } else {
      set(
        element,
        (key as ElementSettingsComplexKey)?.to || key as string,
        (key as ElementSettingsComplexKey)?.from ? get(
          value,
          (key as ElementSettingsComplexKey).from,
          (key as ElementSettingsComplexKey)?.default
        ) : value ?? (key as ElementSettingsComplexKey)?.default
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
    this.#history = [cloneDeep(this.#content)];
    this.#historyIndex = 0;
    this.emit('history.reset', this.#history, this.#historyIndex);
  }
}
