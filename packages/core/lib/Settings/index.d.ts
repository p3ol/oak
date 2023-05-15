import {
  ComponentSettingsTab,
  ComponentSettingsField,
  ComponentSettingsTabObject,
  ComponentSettingsFieldObject,
} from '../types';
import { Builder } from '../Builder';
import { Emitter } from '../Emitter';

export declare class Settings extends Emitter {
  static TYPE_TAB: string;
  static TYPE_SETTING: string;

  static SETTINGS_TAB_GENERAL: string;
  static SETTINGS_TAB_STYLING: string;
  static SETTINGS_TAB_RESPONSIVE: string;

  constructor(options?: { builder: Builder });

  hasTab(id: string): boolean;
  getTab(id: string): ComponentSettingsTab;

  hasSetting(id: string, opts?: { tabId?: string }): boolean;
  getSetting(id: string, opts?: { tabId?: string }): ComponentSettingsField;

  add(
    setting: ComponentSettingsTab |
      ComponentSettingsTabObject |
      ComponentSettingsField |
      ComponentSettingsFieldObject
  ): void;
  remove(id: string): boolean;

  all(): Array<ComponentSettingsTab | ComponentSettingsField>;
}
