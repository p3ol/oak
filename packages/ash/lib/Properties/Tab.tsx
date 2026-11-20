import { type Key, type ComponentPropsWithoutRef } from 'react';
import type {
  ComponentObject,
  ComponentSettingsTabObject,
  ComponentSettingsFieldObject,
  ElementObject,
  ComponentOverride,
  SettingOverride,
  FieldOverride,
  FieldObject,
  FieldOverrideObject,
} from '@oakjs/core';
import {
  type FieldContent,
  Tabs,
  classNames,
  cloneDeep,
  exists,
} from '@junipero/react';

import { sortFields, withOverrideFields } from './fields';
import Setting from './Setting';
import SettingsGroup from './SettingsGroup';
import { useBuilder } from '../hooks';
import Text from '../Text';

export interface TabProps extends ComponentPropsWithoutRef<'div'> {
  tab: ComponentSettingsTabObject | ComponentSettingsFieldObject;
  component: ComponentObject;
  element: ElementObject;
  subtabs?: (ComponentSettingsTabObject | ComponentSettingsFieldObject)[];
  overrides?: ComponentOverride | SettingOverride | FieldOverride;
  onSettingChange?(name: string, field: FieldContent): void;
  onSettingCustomChange?(
    name: string,
    renderer: FieldOverride | FieldObject | FieldOverrideObject,
    field: FieldContent
  ): void;
  onUpdate?(elmt: ElementObject): void;
}

const Tab = ({
  tab,
  component,
  element,
  subtabs,
  overrides,
  className,
  onUpdate,
  onSettingChange,
  onSettingCustomChange,
  ...rest
}: TabProps) => {
  const { builder } = useBuilder();

  return (
    <div
      { ...rest }
      className={classNames(
        'fields oak:py-4 oak:flex oak:flex-col oak:gap-4',
        { 'oak:pt-0': subtabs?.length > 0 },
        className,
      )}
    >
      { sortFields(builder, element.type, withOverrideFields(
        builder,
        element.type,
        (component.settings?.fields || []) as ComponentSettingsFieldObject[],
      )
        // Groups (e.g. hover styles) only display their own fields
        .filter((field: ComponentSettingsFieldObject) =>
          tab.type !== 'group' && exists(tab.id) && (
            (tab.id === 'general' && !field.tab) ||
            field.tab === tab.id
          )
        )
        .concat(tab.fields || []))
        .map((setting: ComponentSettingsFieldObject) =>
          setting.type === 'group' ? (
            <SettingsGroup
              key={setting.key as Key}
              setting={setting}
              component={component}
              element={element}
              onSettingChange={onSettingChange}
              onSettingCustomChange={onSettingCustomChange}
              onUpdate={onUpdate}
            />
          ) : (
            <Setting
              key={setting.key as Key}
              setting={setting}
              component={component}
              element={element}
              onSettingChange={onSettingChange}
              onSettingCustomChange={onSettingCustomChange}
            />
          )
        ) }
      { subtabs && (
        <Tabs
          className="oak-ash-tabs oak-ash-subtabs"
          tabs={subtabs.map(subtab => ({
            title: <Text>{subtab.title}</Text>,
            content: (
              <Tab
                key={subtab.id}
                tab={subtab}
                component={component}
                element={element}
                overrides={overrides}
                onUpdate={onUpdate}
                onSettingChange={onSettingChange}
                onSettingCustomChange={onSettingCustomChange}
              />
            ),
          }))}
        />
      )}
      { tab?.type === 'tab' &&
        (tab as ComponentSettingsTabObject).renderForm?.({
          element: cloneDeep(element),
          component,
          overrides,
          update: onUpdate,
        }) }
    </div>
  );
};

Tab.displayName = 'Tab';

export default Tab;
