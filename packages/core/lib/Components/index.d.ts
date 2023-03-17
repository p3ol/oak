import { Component, ComponentsGroup } from '../types';

export declare class Components {
  static TYPE_COMPONENT: string;
  static TYPE_GROUP: string;

  static COMPONENTS_GROUP_CORE: string;
  static COMPONENTS_GROUP_OTHER: string;

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
