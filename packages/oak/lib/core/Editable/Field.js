import { get } from '@junipero/react';

import { useBuilder, useOptions } from '../../hooks';

export default ({
  field,
  element,
  onChange,
  onCustomChange,
  editableRef,
}) => {
  const options = useOptions();
  const { getOverrides, getText } = useBuilder();
  const renderer = getOverrides('component', element.type,
    { output: 'field', field });

  const commonProps = {
    id: field.id,
    name: field.name,
    disabled: field.disabled,
    onChange: renderer.onChange
      ? onCustomChange.bind(null, field.key, renderer)
      : onChange.bind(null, field.key),
    value: get(element, field.key) ?? field.default,
    required: field.required,
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
    t: getText,
  }) || null;
};
