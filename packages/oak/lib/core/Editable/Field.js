import { get } from '@poool/junipero-utils';

import { useBuilder, useOptions } from '../../hooks';

export default ({
  field,
  element,
  onChange,
  onCustomChange,
}) => {
  const options = useOptions();
  const { getField } = useBuilder();
  const renderer = getField(field.type) || field;

  const commonProps = {
    id: field.id,
    name: field.name,
    onChange: renderer.onChange
      ? onCustomChange.bind(null, field.key, renderer)
      : onChange.bind(null, field.key),
    value: get(element, field.key) ?? field.default,
  };

  if (field.condition && !field.condition(element)) {
    return null;
  }

  return renderer.render?.(commonProps, {
    field,
    element,
    options,
  });
};
