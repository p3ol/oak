import { useMemo } from 'react';
import { get } from '@junipero/react';

import Text from '../Text';

const Property = ({
  element,
  field,
}) => {
  const value = useMemo(() => (
    get(element, field.key, field.default)
  ), [element, field]);
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
        { option ? (
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
