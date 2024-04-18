import { ComponentPropsWithoutRef, useMemo } from 'react';
import { get } from '@junipero/react';

import Text from '../Text';
import { ComponentOverride, ComponentOverrideObject, ElementObject } from '../../../core/lib/types';

export declare interface PropertyProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
  field: {
    key: string;
    label: string;
    default?: any;
    options?: { value: any, title: string }[];
  };
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

  const value = get(element, field.key as string, field.default);

  const option = useMemo(() => (
    field.options
      ? field.options.find(o => o.value === value || o === value)
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
