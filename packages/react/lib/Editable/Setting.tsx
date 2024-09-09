import type {
  SettingOverride,
  ComponentObject,
  ComponentSettingsFieldObject,
  ElementObject,
  FieldObject,
  FieldOverride,
  FieldOverrideObject,
} from '@oakjs/core';
import { type MutableRefObject, useMemo } from 'react';
import {
  type FieldContent,
  Abstract,
  FieldControl,
  Label,
  Tooltip,
  classNames,
} from '@junipero/react';

import type { EditableRef } from './index';
import { useBuilder } from '../hooks';
import Text from '../Text';
import Icon from '../Icon';
import Field from './Field';

export interface SettingProps {
  setting: ComponentSettingsFieldObject;
  component: ComponentObject;
  element: ElementObject;
  editableRef?: MutableRefObject<EditableRef>;
  onSettingChange?(name: string, field: FieldContent): void;
  onSettingCustomChange?(
    name: string,
    renderer: FieldOverride | FieldObject | FieldOverrideObject,
    field: FieldContent
  ): void;
}

const Setting = ({
  setting,
  component,
  element,
  editableRef,
  onSettingChange,
  onSettingCustomChange,
}: SettingProps) => {
  const { builder } = useBuilder();

  const override = useMemo(() => (
    builder.getOverride('setting', element.type, { setting }) as SettingOverride
  ), [element, setting]);

  const hasSubfields = useMemo(() => (
    Array.isArray(override?.fields || setting.fields) &&
    (override?.fields || setting.fields).length > 0
  ), [setting, override]);

  const condition = override?.condition || setting.condition;

  if (
    condition &&
    !condition(element, { component, builder })
  ) {
    return null;
  }

  return (
    <div className="field">
      <FieldControl>
        { (override?.label || setting.label) && (
          <Label
            className="oak-flex oak-items-center oak-gap-2"
          >
            <Text>{ (override?.label || setting.label) as string }</Text>
            { (override?.info || setting.info) && (
              <Tooltip
                text={
                  <Text>{ (override?.info || setting.info) as string }</Text>
                }
              >
                <Icon className="!oak-text-[18px]">
                  info_circle
                </Icon>
              </Tooltip>
            ) }
          </Label>
        ) }
        { hasSubfields ? (
          <div
            className={classNames(
              'sub-fields oak-flex oak-gap-2',
            )}
          >
            { (override?.fields || setting.fields).map((f, n) => (
              <div className="field" key={n}>
                <FieldControl>
                  { f.label && (
                    <Label
                      className={classNames(
                        'field-label oak-flex oak-items-center',
                        'oak-gap-1'
                      )}
                    >
                      <Text>{ f.label as string }</Text>
                      { f.info && (
                        <Tooltip
                          text={
                            <Text>{ f.info as string }</Text>
                          }
                        >
                          <Icon className="!oak-text-[14px]">
                            info_circle
                          </Icon>
                        </Tooltip>
                      ) }
                    </Label>
                  ) }
                  <Field
                    setting={f}
                    editableRef={editableRef}
                    element={element}
                    component={component}
                    onChange={onSettingChange}
                    onCustomChange={onSettingCustomChange}
                  />
                </FieldControl>
              </div>
            )) }
          </div>
        ) : (
          <Field
            setting={setting}
            editableRef={editableRef}
            element={element}
            component={component}
            onChange={onSettingChange}
            onCustomChange={onSettingCustomChange}
          />
        ) }
        { (override?.description || setting.description) && (
          <Abstract className="secondary">
            <Text>{ override?.description || setting.description }</Text>
          </Abstract>
        ) }
      </FieldControl>
    </div>
  );
};

Setting.displayName = 'Setting';

export default Setting;
