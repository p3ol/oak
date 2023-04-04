import { ComponentSettingsTab, ComponentSettingsField } from '../types';
import Emitter from '../Emitter';

export default class Settings extends Emitter {
  static TYPE_TAB = 'tab';
  static TYPE_SETTING = 'setting';

  static SETTINGS_TAB_GENERAL = 'general';
  static SETTINGS_TAB_STYLING = 'styling';
  static SETTINGS_TAB_RESPONSIVE = 'responsive';

  #builder = null;
  #tabs = null;

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
    this.#tabs = [new ComponentSettingsTab({
      type: Settings.TYPE_TAB,
      id: Settings.SETTINGS_TAB_GENERAL,
      title: t => t('core.settings.title', 'Settings'),
      fields: [],
    })];
  }

  hasTab (id) {
    return this.#tabs.some(ComponentSettingsTab.FIND_PREDICATE(id));
  }

  getTab (id) {
    return this.#tabs.find(ComponentSettingsTab.FIND_PREDICATE(id));
  }

  hasSetting (id, { tabId } = {}) {
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

  getSetting (id, { tabId } = {}) {
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

  add (setting) {
    if (
      setting.type === Settings.TYPE_TAB &&
      !this.hasTab(setting.id)
    ) {
      setting = new ComponentSettingsTab(setting);
      this.#tabs.push(setting);
      this.emit('tabs.add', setting);

      return;
    }

    setting = new ComponentSettingsField(setting);

    const tab = setting.tab && this.hasTab(setting.tab)
      ? this.getTab(setting.tab)
      : this.#tabs.find(ComponentSettingsTab.FIND_PREDICATE(
        Settings.SETTINGS_TAB_GENERAL
      ));

    const existing = this
      .getSetting(setting.id || setting.key, { tabId: tab.id });

    if (existing) {
      this.#builder.logger.log(
        'Setting already exists, updating definition.',
        'Old:', existing,
        'New:', setting
      );

      const index = tab.fields.indexOf(existing);
      tab.fields[index] = setting;
      this.emit('settings.update', setting, tab);
    } else {
      tab.fields.push(setting);
      this.emit('settings.add', setting, tab);
    }
  }

  remove (id) {
    const tabIndex = this.#tabs
      .findIndex(ComponentSettingsTab.FIND_PREDICATE(id));

    if (tabIndex !== -1) {
      const tab = this.#tabs[tabIndex];
      this.#tabs.splice(tabIndex, 1);
      this.emit('tabs.remove', tab);

      return true;
    }

    for (const tab of this.#tabs) {
      const index = tab.fields
        .findIndex(ComponentSettingsField.FIND_PREDICATE(id));

      if (index !== -1) {
        const setting = tab.fields[index];
        tab.fields.splice(index, 1);
        this.emit('settings.remove', setting);

        return true;
      }
    }

    return false;
  }

  getDisplayable (element, { fields = this.#tabs } = {}) {
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
    return this.#tabs;
  }

  toJSON () {
    return this.all();
  }
}
