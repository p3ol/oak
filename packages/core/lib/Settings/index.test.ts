import { vi } from 'vitest';

import type { ComponentSettingsFieldObject } from '../types';
import Settings from './index';

describe('Settings', () => {
  it('should allow to manage settings', () => {
    const cb = vi.fn();
    const settings = new Settings();
    settings.subscribe(cb);

    const setting: ComponentSettingsFieldObject = {
      type: 'text', key: 'test', label: 'Test',
    };

    settings.add(setting);
    expect(settings.getSetting('test')).toMatchObject(setting);

    expect(cb).toHaveBeenCalledWith(
      'settings.add',
      expect.objectContaining(setting),
      expect.objectContaining({ id: 'general' })
    );
  });

  it('should allow to add a new tab and add settings to it', () => {
    const cb = vi.fn();
    const settings = new Settings();
    settings.subscribe(cb);

    const tab = { id: 'test', type: 'tab' };
    const setting = { key: 'test', type: 'text', tab: 'test' };

    settings.add(tab);
    expect(cb).toHaveBeenCalledWith(
      'tabs.add',
      expect.objectContaining(tab)
    );
    expect(settings.getTab('test')).toMatchObject(tab);

    settings.add(setting);
    expect(cb).toHaveBeenLastCalledWith(
      'settings.add',
      expect.objectContaining(setting),
      expect.objectContaining(tab)
    );
    expect(settings.getSetting('test')).toMatchObject(setting);

    const anotherSetting = { key: 'foo', type: 'text', tab: 'test' };
    settings.add(anotherSetting);

    expect(settings).toMatchSnapshot();
  });
});
