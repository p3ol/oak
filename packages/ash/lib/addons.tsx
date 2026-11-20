import type { ComponentsGroupObject } from '@oakjs/core';
import {
  type TextFieldProps,
  type SelectFieldProps,
  type ColorFieldProps,
  type ToggleProps,
  type DateFieldProps,
  type SelectFieldOptionObject,
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
  classNames,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import * as coreAddons from '@oakjs/core/addons';
import * as renderers from '@oakjs/react-renderer';

import type {
  AshAddonObject,
  AshComponentObject,
  AshFieldObject,
  BaseAddonOptions,
  CommonFieldProps,
} from './types';
import { type ImageFieldProps, ImageField } from './fields';
import Text from './Text';
import DynamicComponent from './DynamicComponent';
import ColIcon from './Icon/ColIcon';

export const textField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.textField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: TextFieldProps & CommonFieldProps) => (
    <TextField
      { ...fieldProps }
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting.placeholder),
      } }
      type={fieldOptions.setting?.valueType || 'text'}
    />
  ),
  ...props,
});

export const textareaField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.textareaField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: TextFieldProps & CommonFieldProps) => (
    <TextField
      { ...fieldProps }
      tag="textarea"
      rows={fieldProps.rows || 4}
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting.placeholder),
      } }
      type={fieldOptions.setting?.valueType || 'text'}
    />
  ),
  ...props,
});

export const selectField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.selectField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: SelectFieldProps & CommonFieldProps) => (
    <SelectField
      clearable={false}
      { ...fieldProps }
      options={fieldOptions.setting?.options}
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting.placeholder),
      } }
      animateMenu={slideInDownMenu}
      parseTitle={fieldOptions.setting?.parseTitle ||
        ((o: SelectFieldOptionObject) =>
          o?.title ? fieldOptions.t?.(o.title) : o)}
      parseValue={fieldOptions.setting?.parseValue ||
        ((o: SelectFieldOptionObject) => o?.value ?? o)}
      container={fieldOptions.floatingsRef?.current}
    />
  ),
  ...props,
});

export const tagsField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.tagsField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: SelectFieldProps & CommonFieldProps) => (
    <DynamicComponent
      renderer={selectField().render}
      multiple={true}
      allowArbitraryItems={true}
      noOptionsEnabled={false}
      clearable={true}
      { ...fieldProps }
      fieldOptions={fieldOptions}
    />
  ),
  ...props,
});

export const colorField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.colorField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ColorFieldProps & CommonFieldProps) => (
    <ColorField
      { ...fieldProps }
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting.placeholder),
      } }
      container={fieldOptions.floatingsRef?.current}
    />
  ),
  ...props,
});

export const imageField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.imageField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ImageFieldProps & CommonFieldProps) => (
    <ImageField
      { ...fieldProps }
      className={classNames(
        fieldProps?.className,
        (fieldOptions.setting?.props as any)?.className
      )}
      setting={fieldOptions.setting}
      element={fieldOptions.element}
    />
  ),
  ...props,
});

export const dateField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.dateField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: DateFieldProps & CommonFieldProps) => (
    <DateField
      { ...fieldProps }
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting.placeholder),
      } }
      container={fieldOptions.floatingsRef?.current}
      value={
        typeof fieldProps.value === 'string'
          ? new Date(fieldProps.value) : fieldProps.value
      }
    />
  ),
  ...props,
});

export const toggleField = (props?: AshFieldObject): AshFieldObject => ({
  ...coreAddons.toggleField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ToggleProps & CommonFieldProps & { value?: boolean }) => (
    <Toggle { ...fieldProps } checked={fieldProps.value}>
      <Text>
        { fieldProps.value
          ? fieldOptions.setting?.checkedLabel
          : fieldOptions.setting?.uncheckedLabel }
      </Text>
    </Toggle>
  ),
  ...props,
});

const withRenderer = (
  core: ReturnType<typeof coreAddons.rowComponent>,
  render: AshComponentObject['render'],
  props?: AshComponentObject,
): AshComponentObject => ({
  ...core,
  options: [],
  render,
  ...props,
} satisfies AshComponentObject);

export const rowComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.rowComponent(), renderers.Row, props);

export const colComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.colComponent(), renderers.Col, {
    icon: () => <ColIcon />,
    ...props,
  } satisfies AshComponentObject);

export const emptySpaceComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.emptySpaceComponent(), renderers.EmptySpace, props);

export const titleComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.titleComponent(), renderers.Title, props);

export const textComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.textComponent(), renderers.Text, props);

export const imageComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.imageComponent(), renderers.Image, props);

export const buttonComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.buttonComponent(), renderers.Button, props);

export const foldableComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.foldableComponent(), renderers.Foldable, props);

export const clickableComponent = (props?: AshComponentObject) =>
  withRenderer(coreAddons.clickableComponent(), renderers.Clickable, props);

export const baseFields = (): AshFieldObject[] => [
  textField(),
  textareaField(),
  selectField(),
  tagsField(),
  colorField(),
  imageField(),
  dateField(),
  toggleField(),
];

export const baseComponents = (): AshComponentObject[] => [
  rowComponent(),
  colComponent(),
  emptySpaceComponent(),
  titleComponent(),
  textComponent(),
  imageComponent(),
  buttonComponent(),
  foldableComponent(),
  clickableComponent(),
];

export const coreComponentsGroup = (): ComponentsGroupObject => ({
  ...coreAddons.coreComponentsGroup(),
  components: baseComponents() as any[],
});

export const baseAddon = (opts: BaseAddonOptions = {}): AshAddonObject => ({
  ...coreAddons.baseAddon(opts),
  components: [coreComponentsGroup()],
  fields: baseFields(),
  overrides: [],
});
