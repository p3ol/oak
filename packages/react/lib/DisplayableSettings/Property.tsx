import { type ComponentPropsWithoutRef, useMemo } from 'react';
import type {
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ComponentSettingsFieldOptionObject,
  ElementObject,
} from '@oakjs/core';
import { get, classNames } from '@junipero/react';

import { assignDefined } from '../utils';
import Text from '../Text';

interface PropertyProps extends ComponentPropsWithoutRef<'span'> {
  element: ElementObject;
  field: ComponentSettingsFieldObject;
  override?: ComponentOverrideObject | ComponentOverride;
}

const Property = ({
  element,
  field: setting,
  override,
  className,
  ...rest
}: PropertyProps) => {
  const field = useMemo<ComponentSettingsFieldObject>(() => assignDefined(
    setting,
    override?.fields?.find(f => f.key === setting.key) || {},
  ), [setting, override]);

  const value = useMemo(() => (
    get(element, field.key as string, field.default)
  ), [element, Object.values(element), field]);

  const option = useMemo(() => (
    field.options?.find((o: ComponentSettingsFieldOptionObject) => (
      o.value === value || o === value
    ))
  ), [field, value]);

  return (
    <span { ...rest } className={classNames('property', className)}>
      <span className="key">
        <Text>{ field.label }</Text>
        <Text name="core.propertyPairSeparator" default=": " />
      </span>
      <span className="value">
        { option?.title ? (
          <Text>{ option.title }</Text>
        ) : (
          <Text>{ value }</Text>
        ) }
      </span>
    </span>
  );
};

Property.displayName = 'Property';

export default Property;
