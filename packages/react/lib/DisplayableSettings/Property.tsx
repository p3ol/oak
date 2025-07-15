import { type ComponentPropsWithoutRef, useMemo } from 'react';
import {
  type ComponentOverride,
  type ComponentOverrideObject,
  type ComponentSettingsFieldObject,
  type ComponentSettingsFieldOptionObject,
  type ElementObject,
  assignDefined,
} from '@oakjs/core';
import { get, classNames } from '@junipero/react';

import Text from '../Text';
import { ReactComponentSettingsFieldObject } from '../types';

interface PropertyProps extends ComponentPropsWithoutRef<'span'> {
  element: ElementObject;
  field: ReactComponentSettingsFieldObject;
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
    get(element, field.key as string, typeof field.default === 'function'
      ? field.default(element) : field.default)
  ), [
    element,
    // Only checking on element prevents from updating the render when a sub
    // property of the element changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(element),
    field,
  ]);

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
          <Text>{ setting.display(value) }</Text>
        ) }
      </span>
    </span>
  );
};

Property.displayName = 'Property';

export default Property;
