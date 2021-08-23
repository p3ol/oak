import { get } from '@poool/junipero-utils';

import { useBuilder, useOptions } from '../../hooks';

export default ({
  field,
  element,
  onChange,
  onCustomChange,
  editableRef,
}) => {
  const options = useOptions();
  const { getField, getOverrides } = useBuilder();
  const componentOverrides = getOverrides('component', element.type);
  const type = componentOverrides?.fields
    .find(f => f.key === field.key)?.type || field.type;
  const renderer = Object.assign(getField(type) || field,
    getOverrides('field', field.type));

  const commonProps = {
    id: field.id,
    name: field.name,
    disabled: field.disabled,
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
    editableRef,
    onChange,
  }) || null;
};
