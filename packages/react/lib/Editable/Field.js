import { get } from '@junipero/react';

import { useBuilder } from '../hooks';

const Field = ({
  field,
  element,
  onChange,
  onCustomChange,
  editableRef,
}) => {
  // const options = useOptions();
  const { builder } = useBuilder();
  const renderer = builder.getOverride('component', element.type,
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
    // options,
    editableRef,
    onChange,
    t: builder.getText,
  }) || null;
};

Field.displayName = 'Field';

export default Field;
