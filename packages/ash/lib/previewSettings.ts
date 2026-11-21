import type {
  Builder,
  ComponentObject,
  ElementObject,
  SettingOverride,
} from '@oakjs/core';

import type {
  AshAddonObject,
  PreviewSettingObject,
  PreviewValue,
} from './types';

/**
 * Page settings are edited like an element of type `page`, so that settings
 * overrides can target them (`targets: ['page']`)
 */
export const PAGE_COMPONENT = {
  id: 'page',
  type: 'component',
} as ComponentObject;

declare interface PreviewFilter {
  setting: PreviewSettingObject;
  value: any;
}

/**
 * Preview settings of the given addons (and extra ones)
 */
export const getPreviewSettings = (
  addons: AshAddonObject[] = [],
  extra: PreviewSettingObject[] = [],
): PreviewSettingObject[] => [
  ...extra,
  ...addons.flatMap(addon => addon?.previewSettings || []),
];

/**
 * Preview settings hiding elements, if displayed (same conditions as in the
 * page properties), with their value (or default)
 */
export const getPreviewFilters = (
  builder: Builder,
  settings: PreviewSettingObject[],
  previewValue: PreviewValue,
): PreviewFilter[] => {
  const element = { ...previewValue, type: 'page' };
  const filters: PreviewFilter[] = [];

  const walk = (list: PreviewSettingObject[]) => list.forEach(setting => {
    const override = builder.getOverride(
      'setting', 'page', { setting }
    ) as SettingOverride;
    const condition = override?.condition || setting.condition;

    if (condition && !condition(element, {
      component: PAGE_COMPONENT,
      builder,
    })) {
      return;
    }

    if (Array.isArray(setting.fields)) {
      walk(setting.fields);
    }

    if (
      setting.key &&
      (setting.isElementDisplayed || setting.onElementEvent)
    ) {
      const def = typeof setting.default === 'function'
        ? setting.default(element)
        : setting.default;

      filters.push({
        setting,
        value: builder.getElementSettings(element, setting.key, def),
      });
    }
  });

  walk(settings);

  return filters;
};

/**
 * Whether an element is displayed, given the preview filters
 */
export const isDisplayedWith = (
  filters: PreviewFilter[],
  element: ElementObject,
  previewValue: PreviewValue,
) => filters.every(({ setting, value }) => (
  !setting.isElementDisplayed ||
  setting.isElementDisplayed(element, value, previewValue)
));

/**
 * New values of the preview settings once an element of the canvas emitted
 * an event (see `PreviewSettingObject.onElementEvent`), or `null` when none
 * of them changed
 */
export const getPreviewEventValue = (
  builder: Builder,
  filters: PreviewFilter[],
  previewValue: PreviewValue,
  element: ElementObject,
  eventName?: string,
): PreviewValue | null => {
  let next: ElementObject | null = null;

  filters.forEach(({ setting, value }) => {
    const updated = setting.onElementEvent?.(element, value, eventName);

    if (updated === undefined) {
      return;
    }

    // Edited like the preview section does (see PageProperties)
    next = next || { ...structuredClone(previewValue), type: 'page' };
    builder.setElementSettings(next, setting.key, updated);
  });

  if (!next) {
    return null;
  }

  const { type: _, ...value } = next as ElementObject;

  return value;
};
