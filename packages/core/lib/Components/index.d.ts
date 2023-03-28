import { Component, ComponentsGroup } from '../types';
import { Builder } from '../Builder';
import { Emitter } from '../Emitter';

export declare class Components extends Emitter {
  static TYPE_COMPONENT: string;
  static TYPE_GROUP: string;
  static COMPONENTS_GROUP_CORE: string;
  static COMPONENTS_GROUP_OTHER: string;

  constructor(options?: { builder: Builder });

  hasGroup(id: string): boolean;
  getGroup(id: string): ComponentsGroup;

  hasComponent(id: string, opts?: { groupId?: string }): boolean;
  getComponent(id: string, opts?: { groupId?: string }): Component;

  append(component: object): void;
  prepend(component: object): void;
  add(component: object, opts?: { mode?: string }): void;
  remove(id: string): void;
  getAll(): object;
  toJSON(): object;
}
