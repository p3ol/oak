import {
  ComponentSettingsTab,
  ComponentSettingsField,
  ComponentSettingsTabObject,
  ComponentSettingsFieldObject,
  ElementObject,
  SettingOverrideObject,
} from '../types';
import Emitter from '../Emitter';
import Builder from '../Builder';

export declare class ISettings extends Emitter {
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
export default class Settings extends Emitter implements ISettings {
  static TYPE_TAB: string = 'tab';
  static TYPE_SETTING = 'setting';

  static SETTINGS_TAB_GENERAL = 'general';
  static SETTINGS_TAB_STYLING = 'styling';
  static SETTINGS_TAB_RESPONSIVE = 'responsive';

  #builder: Builder = null;
  #tabs: Array<ComponentSettingsTab> = null;

  constructor ({ builder }: { builder?: Builder } = {}) {
    super();

    this.#builder = builder;
    this.#tabs = [new ComponentSettingsTab({
      type: Settings.TYPE_TAB,
      id: Settings.SETTINGS_TAB_GENERAL,
      title: (
        t: (key: string, def: string) => string
      ) => t('core.settings.title', 'Settings'),
      fields: [],
    })];
  }

  hasTab (id: string) {
    return this.#tabs.some(ComponentSettingsTab.FIND_PREDICATE(id));
  }

  getTab (id: string) {
    return this.#tabs.find(ComponentSettingsTab.FIND_PREDICATE(id));
  }

  hasSetting (id: string, { tabId }: { tabId?: string} = {}) {
    if (tabId) {
      return this.getTab(tabId)?.fields
        .some(ComponentSettingsField.FIND_PREDICATE(id));
    }

    for (const tab of this.#tabs) {
      if (tab.fields.some(ComponentSettingsField.FIND_PREDICATE(id))) {
        return true;
      }
    }

    return false;
  }

  getSetting (id: string, { tabId }: { tabId?: string} = {}) {
    if (tabId) {
      return this.getTab(tabId)?.fields
        .find(ComponentSettingsField.FIND_PREDICATE(id));
    }

    for (const tab of this.#tabs) {
      const setting = tab.fields
        .find(ComponentSettingsField.FIND_PREDICATE(id));

      if (setting) {
        return setting;
      }
    }
  }

  add (setting: ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject) {
    if (
      (setting as ComponentSettingsFieldObject).type === Settings.TYPE_TAB &&
      !this.hasTab(setting.id)
    ) {
      const setting_ = new ComponentSettingsTab(setting as ComponentSettingsTabObject);
      this.#tabs.push(setting_);
      this.emit('tabs.add', setting);

      return;
    }

    const setting_ = new ComponentSettingsField(
      setting as ComponentSettingsFieldObject
    ) as ComponentSettingsField;

    const tab = setting_.tab && this.hasTab(setting_.tab)
      ? this.getTab(setting_.tab)
      : this.#tabs.find(ComponentSettingsTab.FIND_PREDICATE(
        Settings.SETTINGS_TAB_GENERAL
      ));

    const existing = this
      .getSetting((setting_.id || setting_.key) as string, { tabId: tab.id });

    if (existing) {
      this.#builder?.logger.log(
        'Setting already exists, updating definition.',
        'Old:', existing,
        'New:', setting_
      );

      const index = tab.fields.indexOf(existing);
      tab.fields[index] = setting_;
      this.emit('settings.update', setting_, tab);
    } else {
      tab.fields.push(setting_);
      this.emit('settings.add', setting_, tab);
    }
  }

  remove (id: string) {
    const tabIndex = this.#tabs
      .findIndex(ComponentSettingsTab.FIND_PREDICATE(id));

    if (tabIndex !== -1) {
      this.#builder?.logger.log('Removing tab:', this.#tabs[tabIndex]);
      const tab = this.#tabs[tabIndex];
      this.#tabs.splice(tabIndex, 1);
      this.emit('tabs.remove', tab);

      return true;
    }

    for (const tab of this.#tabs) {
      const index = tab.fields
        .findIndex(ComponentSettingsField.FIND_PREDICATE(id));

      if (index !== -1) {
        this.#builder?.logger.log('Removing setting:', tab.fields[index]);
        const setting = tab.fields[index];
        tab.fields.splice(index, 1);
        this.emit('settings.remove', setting);

        return true;
      }
    }

    return false;
  }

  getDisplayable (
    element: ElementObject,
    { fields = this.#tabs }: { fields?: Array<ComponentSettingsTab>} = {}
  ): Array<ComponentSettingsField | ComponentSettingsTab> {
    const displayable = [];

    for (const setting of fields) {
      if (Array.isArray(setting.fields)) {
        displayable.push(...this.getDisplayable(element, {
          fields: setting.fields,
        }));
      }

      if (
        setting.displayable === true ||
        (
          typeof setting.displayable === 'function' &&
          setting.displayable({ element, builder: this.#builder })
        )
      ) {
        displayable.push(setting);
      }
    }

    return displayable;
  }

  all () {
    return this.#tabs;// TODO to object
  }

  toJSON () {
    return this.all();
  }
}
