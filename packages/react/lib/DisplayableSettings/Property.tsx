import { useMemo } from 'react';
import type {
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ComponentSettingsFieldOptionObject,
  ElementObject,
} from '@oakjs/core';
import { get } from '@junipero/react';

import Text from '../Text';

interface PropertyProps {
  element: ElementObject;
  field: ComponentSettingsFieldObject;
  override?: ComponentOverrideObject | ComponentOverride;
}

const Property = ({
  element,
  field: setting,
  override,
}: PropertyProps) => {
  const field = useMemo(() => ({
    ...setting,
    ...override?.fields?.find(f => f.key === setting.key) || {},
  }), [setting, override]);

  const value = get(element, field.key, field.default);

  const option = useMemo(() => (
    field.options
      ? field.options.find(
        (o: { value: Record<string, any>[]}) =>
          o.value === value || o === value)
      : null
  ), [field, value]);

  return (
    <span className="property">
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
