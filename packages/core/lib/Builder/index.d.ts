import {
  AddonObject,
  ElementObject,
  BuilderOptions,
  Component,
  ComponentObject,
  ComponentsGroup,
  ComponentOverride,
  Field,
  FieldObject,
  FieldOverride,
  TextsSheet,
  TextsSheetObject,
  ComponentSettingsField,
  SettingOverride,
  ComponentOverrideObject,
  ElementId,
  ComponentSettingsFieldKeyTuple,
  GetTextCallback,
  ComponentSettingsTab,
} from '../types';
import { Logger } from '../Logger';
import { Emitter, EmitterCallback } from '../Emitter';

export declare class Builder extends Emitter {
  constructor(opts?: {
    addons?: AddonObject[];
    content?: ElementObject[];
    options?: BuilderOptions;
  });

  options: BuilderOptions;
  logger: Logger;

  subscribe(cb: EmitterCallback): (() => void);
  setAddons(addons: AddonObject[]): void;
  addAddon(addon: AddonObject): void;
  removeAddon(addon: AddonObject): void;
  getAvailableComponents(): ComponentsGroup[];
  getComponent(type: string): Component;
  getComponentDisplayableSettings(
    element: ElementObject,
    opts?: {
      component?: Component | ComponentObject;
      fields?: (Field | FieldObject)[];
    },
  ): ComponentSettingsField[];
  getAvailableFields(): Array<Field>;
  getField(type: string): Field;
  getOverride(
    type: string,
    target: string,
    opts?: {
      output?: 'field';
      setting?: ComponentSettingsField;
    },
  ): ComponentOverride | FieldOverride;
  mergeOverrides(
    overrides: (ComponentOverride | FieldOverride | SettingOverride)[]
  ): void;
  getContent(): ElementObject[];
  setContent(content: ElementObject[], opts?: { emit?: boolean }): void;
  createElement(type: string, opts: {
    component?: Component | ComponentObject;
    override?: ComponentOverride | ComponentOverrideObject;
    baseElement?: ElementObject;
    resetIds?: boolean;
  }): object;
  addElement(element: ElementObject, opts?: {
    component?: Component | ComponentObject;
    parent?: ElementObject[];
    position?: 'before' | 'after';
  }): Element;
  addElements(elements: ElementObject[], options?: {
    parent?: ElementObject[];
    position?: 'before' | 'after';
  }): ElementObject[];
  getElement(id: ElementId): ElementObject;
  removeElement(id: ElementId, opts?: {
    deep?: boolean;
  }): boolean;
  setElement(id: ElementId, updates: ElementObject, opts?: {
    deep?: boolean;
  }): ElementObject;
  moveElement(
    element: ElementObject,
    sibling: ElementObject,
    opts?: {
      deep?: boolean;
      position?: 'before' | 'after';
      parent: ElementObject;
    }
  ): ElementObject;
  duplicateElement(
    element: ElementObject,
    opts?: {
      deep?: boolean;
    }
  ): ElementObject;
  getElementSettings(
    element: ElementObject,
    key: string | string[] | ComponentSettingsFieldKeyTuple[],
    def?: any
  ): any;
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  resetHistory(): void;
  generateId(): string;
  getTextSheet(id: string): TextsSheet;
  getText(key: string | GetTextCallback, def?: any): any;
  setText(key: string, value: any): void;
  getActiveTextSheet(): TextsSheet;
  setActiveTextSheet(id: string): void;
  getAvailableSettings(): (ComponentSettingsTab | ComponentSettingsField)[];
}
