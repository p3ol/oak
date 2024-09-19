import { type Key, type MutableRefObject, useMemo } from 'react';
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
import { type FieldContent, cloneDeep } from '@junipero/react';

import type { EditableRef } from './index';
import { useBuilder } from '../hooks';
import Setting from './Setting';

export interface TabProps {
  tab: ComponentSettingsTabObject;
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
  onUpdate,
  onSettingChange,
  onSettingCustomChange,
}: TabProps) => {
  const { builder } = useBuilder();
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
    <div className="fields oak-flex oak-flex-col oak-gap-4">
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
        .sort((
          a: ComponentSettingsFieldObject,
          b: ComponentSettingsFieldObject
        ) => getFieldPriority(b) - getFieldPriority(a))
        .map((setting: ComponentSettingsFieldObject, i: Key) => (
          <Setting
            key={i}
            setting={setting}
            component={component}
            element={element}
            editableRef={editableRef}
            onSettingChange={onSettingChange}
            onSettingCustomChange={onSettingCustomChange}
          />
        )) }
      { tab?.renderForm?.({
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
