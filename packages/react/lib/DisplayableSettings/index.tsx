import { type ComponentPropsWithoutRef, Fragment, useMemo } from 'react';
import type {
  Component,
  ComponentObject,
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ElementObject,
  SettingOverrideObject,
} from '@oakjs/core';
import { classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Text from '../Text';
import Property from './Property';

export declare interface DisplayableSettingsProps
  extends ComponentPropsWithoutRef<'div'> {
  element?: ElementObject;
  component?: ComponentObject | Component;
  override?: ComponentOverrideObject | ComponentOverride;
}

const DisplayableSettings = ({
  className,
  element,
  component,
  override,
  ...rest
}: DisplayableSettingsProps) => {
  const { builder } = useBuilder();

  const getSettingPriority = (setting: SettingOverrideObject) => {
    const fieldOverride = {
      ...builder.getOverride('setting', element.type, { setting }),
      ...builder.getOverride('component', element.type, {
        output: 'field', setting,
      }),
    };

    return Number.isSafeInteger(fieldOverride?.priority)
      ? fieldOverride.priority
      : setting.priority || 0;
  };

  const displayableSettings = useMemo(() => (
    builder
      .getComponentDisplayableSettings(element, { component })
      .filter(s => !s.condition || s.condition(element))
      .sort((a, b) =>
        getSettingPriority(b as SettingOverrideObject) -
        getSettingPriority(a as SettingOverrideObject)
      )
  ), [element, component]);

  if (displayableSettings.length <= 0) {
    return null;
  }

  return (
    <div
      { ...rest }
      className={classNames(
        'displayable-settings junipero extra !oak-text-alternate-text-color',
        className,
      )}
    >
      { displayableSettings.map((
        setting: ComponentSettingsFieldObject,
        i: number,
      ) => (
        <Fragment key={setting.key as string || i}>
          <Property field={setting} element={element} override={override} />
          { i < displayableSettings.length - 1 && (
            <Text name="core.propertySeparator" default=", " />
          ) }
        </Fragment>
      )) }
    </div>
  );
};

DisplayableSettings.displayName = 'DisplayableSettings';

export default DisplayableSettings;
