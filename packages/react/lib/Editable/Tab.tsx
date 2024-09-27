import {
  type Key,
  type MutableRefObject,
  type ComponentPropsWithoutRef,
  useMemo,
} from 'react';
import {
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
import { type FieldContent, cloneDeep, classNames } from '@junipero/react';

import type { EditableRef } from './index';
import { useBuilder } from '../hooks';
import Setting from './Setting';
import SettingsGroup from './SettingsGroup';

export interface TabProps extends ComponentPropsWithoutRef<'div'> {
  tab: ComponentSettingsTabObject | ComponentSettingsFieldObject;
  component: ComponentObject;
  element: ElementObject;
  overrides?: ComponentOverride | SettingOverride | FieldOverride;
  editableRef?: MutableRefObject<EditableRef>;
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
  overrides,
  editableRef,
  className,
  onUpdate,
  onSettingChange,
  onSettingCustomChange,
  ...rest
}: TabProps) => {
  const { builder, editableType } = useBuilder();
  const componentOverride = useMemo(() => (
    builder.getOverride('component', element.type) as ComponentOverride
  ), [element.type]);

  const getFieldPriority = (field: ComponentSettingsFieldObject) => {
    const fieldOverride = {
      ...builder.getOverride('setting', element.type, { setting: field }),
      ...builder.getOverride('component', element.type, {
        output: 'field', setting: field,
      }),
    };

    return Number.isSafeInteger(fieldOverride?.priority)
      ? fieldOverride.priority
      : field.priority || 0;
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'fields oak-py-2 oak-flex oak-flex-col oak-gap-4',
        {
          'oak-max-h-[500px] oak-overflow-y-auto': editableType !== 'modal',
        },
        className,
      )}
    >
      { (component.settings?.fields || [])
        // Append fields that are only defined inside the component override
        .concat(componentOverride?.fields?.filter(f =>
          !component.settings?.fields?.find(s =>
            s.type !== 'tab' &&
            (s as ComponentSettingsFieldObject).key === f.key
          )
        ) || [])
        .filter((field: ComponentSettingsFieldObject) =>
          (tab.id === 'general' && !field.tab) ||
          field.tab === tab.id
        )
        .concat(tab.fields)
        .filter((field: ComponentSettingsFieldObject) =>
          !field.condition ||
          field.condition(element, { component, builder })
        )
        .sort((
          a: ComponentSettingsFieldObject,
          b: ComponentSettingsFieldObject
        ) => getFieldPriority(b) - getFieldPriority(a))
        .map((setting: ComponentSettingsFieldObject, i: Key) =>
          setting.type === 'group' ? (
            <SettingsGroup
              key={setting.key as Key}
              setting={setting}
              component={component}
              element={element}
              editableRef={editableRef}
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
              editableRef={editableRef}
              onSettingChange={onSettingChange}
              onSettingCustomChange={onSettingCustomChange}
            />
          )
        ) }
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
