import { type Key, useCallback, useMemo } from 'react';
import type {
  ComponentObject,
  ComponentSettingsFieldObject,
  ElementObject,
  FieldObject,
  FieldOverride,
  FieldOverrideObject,
  SettingOverride,
} from '@oakjs/core';
import {
  type FieldContent,
  FieldControl,
  Label,
  Tabs,
  TextField,
  classNames,
  cloneDeep,
} from '@junipero/react';

import type { PagePreset } from '../types';
import { useBuilder, useEditor } from '../hooks';
import Text from '../Text';
import { sortFields, withOverrideFields } from './fields';
import Setting from './Setting';
import SettingsGroup from './SettingsGroup';

/**
 * Page settings are edited like an element of type `page`, so that settings
 * overrides can target them (`targets: ['page']`)
 */
const PAGE_COMPONENT = { id: 'page', type: 'component' } as ComponentObject;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4
    className={classNames(
      'oak:m-0 oak:px-4 oak:text-[11px] oak:uppercase oak:tracking-wide',
      'oak:text-ash-text-muted oak:font-medium',
    )}
  >
    { children }
  </h4>
);

/**
 * Background of the page settings groups' content, when open
 */
const GROUP_CONTENT_CLASS_NAME = 'oak:bg-seashell oak:dark:bg-onyx';

export const DEFAULT_PAGE_PRESETS: PagePreset[] = [
  { id: 'desktop', name: t => t('ash.page.presets.desktop', 'Desktop'), width: 1280 },
  { id: 'laptop', name: t => t('ash.page.presets.laptop', 'Laptop'), width: 1024 },
  { id: 'tablet', name: t => t('ash.page.presets.tablet', 'Tablet'), width: 768 },
  { id: 'mobile', name: t => t('ash.page.presets.mobile', 'Mobile'), width: 375 },
];

export declare interface PagePropertiesProps {
  presets?: PagePreset[];
}

const PageProperties = ({
  presets = DEFAULT_PAGE_PRESETS,
}: PagePropertiesProps) => {
  const { builder, addons, pageTitle, pageDescription } = useBuilder();
  const {
    pageWidth,
    setPageWidth,
    previewModes,
    previewMode,
    setPreviewMode,
    pageSettings,
    pageValue,
    setPageValue,
    tree,
  } = useEditor();

  const element = useMemo<ElementObject>(() => ({
    ...pageValue,
    type: 'page',
  }), [pageValue]);

  const toValue = (elmt: ElementObject) => {
    const { type: _, ...value } = elmt;

    return value;
  };

  const onSettingChange = useCallback((name: string, field: FieldContent) => {
    const next = cloneDeep(element);
    builder.setElementSettings(next, name, field?.checked ?? field?.value);
    setPageValue(toValue(next));
  }, [builder, element, setPageValue]);

  const onSettingCustomChange = useCallback((
    name: string,
    renderer: FieldOverride | FieldObject | FieldOverrideObject,
    field: FieldContent,
  ) => {
    const next = cloneDeep(element);
    Object.assign(next, (renderer as any).onChange(name, field, next));
    setPageValue(toValue(next));
  }, [element, setPageValue]);

  const onUpdate = useCallback((elmt: ElementObject) => {
    setPageValue(toValue(elmt));
  }, [setPageValue]);

  // Same rules as elements settings: component overrides targeting `page` can
  // add fields, and overrides can change their priority
  const settings = useMemo(() => sortFields(
    builder, 'page', withOverrideFields(builder, 'page', pageSettings)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, pageSettings, addons]);

  // Settings of type `tab` are displayed in their own tab, next to a
  // "Settings" tab containing the other ones
  const fields = settings.filter(setting => setting.type !== 'tab');
  const tabs = settings.filter(setting => {
    if (setting.type !== 'tab') {
      return false;
    }

    const override = builder.getOverride(
      'setting', 'page', { setting }
    ) as SettingOverride;
    const condition = override?.condition || setting.condition;

    return !condition || condition(element, { component: PAGE_COMPONENT, builder });
  });

  const renderSettings = (list: ComponentSettingsFieldObject[]) => list
    .map((setting, i) => setting.type === 'group' ? (
      <SettingsGroup
        key={(setting.key || i) as Key}
        bordered={false}
        contentClassName={GROUP_CONTENT_CLASS_NAME}
        setting={setting}
        component={PAGE_COMPONENT}
        element={element}
        onSettingChange={onSettingChange}
        onSettingCustomChange={onSettingCustomChange}
        onUpdate={onUpdate}
      />
    ) : (
      <Setting
        key={(setting.key || i) as Key}
        setting={setting}
        component={PAGE_COMPONENT}
        element={element}
        onSettingChange={onSettingChange}
        onSettingCustomChange={onSettingCustomChange}
      />
    ));

  const onWidthChange = (field: FieldContent) => {
    const width = parseInt(field.value, 10);

    if (Number.isFinite(width) && width >= 200 && width <= 4000) {
      setPageWidth(width);
    }
  };

  return (
    <div className="oak:flex oak:flex-col oak:min-h-0 oak:flex-auto">
      <div
        className={classNames(
          'oak:flex-none oak:px-4 oak:py-3 oak:border-b oak:border-ash-border',
        )}
      >
        <h3 className="oak:m-0 oak:text-sm oak:font-semibold oak:text-ash-text">
          { pageTitle ?? <Text name="ash.page.title">Page</Text> }
        </h3>
        { pageDescription !== null && (
          <p className="oak:m-0 oak:mt-1 oak:text-xs oak:text-ash-text-muted">
            { pageDescription ?? (
              <>
                { tree.nodes.size }{ ' ' }
                <Text name="ash.page.elements">element(s)</Text>
              </>
            ) }
          </p>
        ) }
      </div>
      <div className="oak-ash-page-properties oak:flex-auto oak:min-h-0 oak:overflow-y-auto">
        { tabs.length > 0 ? (
          <div
            className={classNames(
              'oak-ash-page-settings oak:border-b oak:border-ash-border',
            )}
          >
            <Tabs
              className="oak-ash-tabs"
              tabs={[
                ...fields.length > 0 ? [{
                  title: <Text name="ash.page.settings">Settings</Text>,
                  content: (
                    <div className="oak:flex oak:flex-col oak:gap-4 oak:py-4">
                      { renderSettings(fields) }
                    </div>
                  ),
                }] : [],
                ...tabs.map((tab, i) => ({
                  title: <Text>{ tab.title ?? tab.label }</Text>,
                  content: (
                    <div
                      key={(tab.key || i) as Key}
                      className="oak:flex oak:flex-col oak:gap-4 oak:py-4"
                    >
                      { renderSettings(sortFields(
                        builder,
                        'page',
                        (tab.fields || []) as ComponentSettingsFieldObject[],
                      )) }
                    </div>
                  ),
                })),
              ]}
            />
          </div>
        ) : fields.length > 0 && (
          <div
            className={classNames(
              'oak-ash-page-settings oak:flex oak:flex-col oak:gap-4 oak:py-4',
              'oak:border-b oak:border-ash-border',
            )}
          >
            <SectionTitle>
              <Text name="ash.page.settings">Settings</Text>
            </SectionTitle>
            { renderSettings(fields) }
          </div>
        ) }
        <div className="oak:flex oak:flex-col oak:gap-4 oak:py-4">
          <SectionTitle>
            <Text name="ash.page.preview.title">Preview</Text>
          </SectionTitle>
          <div className="oak:flex oak:flex-col oak:gap-4 oak:px-4">
            { previewModes.length > 1 && (
              <div className="field">
                <FieldControl>
                  <Label className="oak:pt-0!">
                    <Text name="ash.preview.mode">Display</Text>
                  </Label>
                  <div className="oak:grid oak:grid-cols-2 oak:gap-2">
                    { previewModes.map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        aria-pressed={previewMode.id === mode.id}
                        onClick={() => setPreviewMode(mode.id)}
                        className={classNames(
                          'oak:flex oak:items-center oak:gap-2 oak:px-3 oak:py-2',
                          'oak:rounded oak:border oak:cursor-pointer oak:text-left',
                          'oak:text-xs',
                          previewMode.id === mode.id
                            ? 'oak:border-velvet oak:bg-ash-accent-soft ' +
                            'oak:text-velvet'
                            : 'oak:border-ash-border oak:bg-ash-surface oak:text-ash-text ' +
                            'oak:hover:border-ash-text-muted',
                        )}
                      >
                        { mode.icon && (
                          <span
                            className={classNames(
                              'oak:flex-none oak:flex',
                              previewMode.id === mode.id
                                ? 'oak:text-velvet' : 'oak:text-ash-text-muted',
                            )}
                          >
                            { mode.icon }
                          </span>
                        ) }
                        <span className="oak:min-w-0">
                          <Text>{ mode.name }</Text>
                        </span>
                      </button>
                    )) }
                  </div>
                </FieldControl>
              </div>
            ) }
            <div className="field">
              <FieldControl>
                <Label className="oak:pt-0!">
                  <Text name="ash.page.preview">Screen size</Text>
                </Label>
                <div className="oak:grid oak:grid-cols-2 oak:gap-2">
                  { presets.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPageWidth(preset.width)}
                      className={classNames(
                        'oak:flex oak:flex-col oak:items-start oak:gap-0.5',
                        'oak:px-3 oak:py-2 oak:rounded oak:border oak:cursor-pointer',
                        'oak:text-left oak:bg-ash-surface',
                        pageWidth === preset.width
                          ? 'oak:border-velvet oak:bg-ash-accent-soft'
                          : 'oak:border-ash-border oak:hover:border-ash-text-muted',
                      )}
                    >
                      <span className="oak:text-sm oak:text-ash-text">
                        <Text>{ preset.name }</Text>
                      </span>
                      <span className="oak:text-xs oak:text-ash-text-muted">
                        { preset.width }px
                      </span>
                    </button>
                  )) }
                </div>
              </FieldControl>
            </div>
            <div className="field">
              <FieldControl>
                <Label className="oak:pt-0!">
                  <Text name="ash.page.width">Width (px)</Text>
                </Label>
                <TextField
                  key={pageWidth}
                  type="number"
                  value={String(pageWidth)}
                  onChange={onWidthChange}
                />
              </FieldControl>
            </div>
            <p className="oak:m-0 oak:text-xs oak:text-ash-text-muted">
              <Text name="ash.page.preview.help">
                Responsive settings are applied based on the page width, so you
                can check how your content behaves on every screen size.
              </Text>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PageProperties.displayName = 'PageProperties';

export default PageProperties;
