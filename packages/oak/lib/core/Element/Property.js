import { get } from '@poool/junipero';

import { useElement } from '../../hooks';
import Text from '../Text';

export default ({
  field,
}) => {
  const { element } = useElement();
  const value = get(element, field.key, field.default);
  const option = field.options
    ? field.options.find(o => o.value === value || o === value)
    : null;

  return (
    <span className="oak-property">
      <Text>{ field.label }</Text>
      <Text name="core.propertyPairSeparator" default=": " />
      { option ? (
        <Text>{ option.title }</Text>
      ) : (
        <Text>{ value }</Text>
      ) }
    </span>
  );
};
