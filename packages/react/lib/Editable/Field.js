import { useMemo } from 'react';

import { useBuilder } from '../hooks';

const Field = ({
  setting,
  element,
  onChange,
  onCustomChange,
  editableRef,
}) => {
  // const options = useOptions();
  const { builder, floatingsRef } = useBuilder();
  const field = useMemo(() => (
    builder.getField(setting?.type)
  ), [setting]);

  const overrides = useMemo(() => (
    builder.mergeOverrides([
      builder.getOverride('component', element.type, {
        output: 'field', field,
      }),
      builder.getOverride('field', field?.type),
    ])
  ), [element, field]);

  const fieldProps = {
    id: setting.id,
    name: setting.name,
    disabled: setting.disabled,
    value: builder.getElementSettings(element, setting.key, setting.default),
    required: setting.required,
    onChange: overrides?.onChange
      ? onCustomChange.bind(null, setting.key, overrides)
      : onChange.bind(null, setting.key),
  };

  if (setting.condition && !setting.condition(element)) {
    return null;
  }

  return (overrides?.render || field?.render)?.(fieldProps, {
    onChange: onChange.bind(null, setting.key),
    field,
    setting,
    overrides,
    element,
    // options,
    editableRef,
    floatingsRef,
    t: builder.getText.bind(builder),
  }) || null;
};

Field.displayName = 'Field';

export default Field;
