import type { ComponentsGroupObject, AddonObject } from '@oakjs/core';
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

import type {
  CommonFieldProps,
  ReactComponentObject,
  ReactFieldObject,
} from './types';
import { dragOption, backgroundColorOption, collapseOption } from './options';
import { type ImageFieldProps, ImageField } from './fields';
import {
  Button,
  Col,
  Clickable,
  EmptySpace,
  Foldable,
  Image,
  Row,
  Text as TextComponent,
  Title,
} from './components';
import Text from './Text';
import DynamicComponent from './DynamicComponent';

export const textField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.textField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: TextFieldProps & CommonFieldProps) => (
    <TextField
      { ...fieldProps }
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t(fieldOptions.setting.placeholder),
      } }
      type={fieldOptions.setting?.valueType || 'text'}
    />
  ),
  ...props,
});

export const textareaField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.textareaField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: TextFieldProps & CommonFieldProps) => (
    <TextField
      { ...fieldProps }
      tag="textarea"
      rows={fieldProps.rows || 5}
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t(fieldOptions.setting.placeholder),
      } }
      type={fieldOptions.setting?.valueType || 'text'}
    />
  ),
  ...props,
});

export const selectField = (props?: ReactFieldObject): ReactFieldObject => ({
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
      container={fieldOptions.editableRef?.current
        ?.innerRef.current as HTMLDivElement}
    />
  ),
  ...props,
});

export const tagsField = (props?: ReactFieldObject): ReactFieldObject => ({
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

export const colorField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.colorField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ColorFieldProps & CommonFieldProps) => (
    <ColorField
      { ...fieldProps }
      { ...fieldOptions.setting?.placeholder && {
        placeholder: fieldOptions.t?.(fieldOptions.setting?.placeholder),
      } }
      container={fieldOptions.editableRef?.current
        ?.innerRef.current as HTMLDivElement}
    />
  ),
  ...props,
});

export const imageField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.imageField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ImageFieldProps & CommonFieldProps) => (
    <ImageField
      { ...fieldProps }
      className={classNames(
        fieldProps?.className,
        fieldOptions.setting?.props?.className
      )}
      setting={fieldOptions.setting}
      element={fieldOptions.element}
    />
  ),
  ...props,
});

export const dateField = (props?: ReactFieldObject): ReactFieldObject => ({
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
      container={fieldOptions.editableRef?.current
        ?.innerRef.current as HTMLDivElement}
      value={
        typeof fieldProps.value === 'string'
          ? new Date(fieldProps.value) : fieldProps.value
      }
    />
  ),
  ...props,
});

export const toggleField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.toggleField(),
  render: ({
    fieldOptions = {},
    ...fieldProps
  }: ToggleProps & CommonFieldProps) => (
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

export const rowComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.rowComponent(),
  render: Row,
  options: [dragOption(), collapseOption(), backgroundColorOption()],
  ...props,
});

export const colComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.colComponent(),
  render: Col,
  ...props,
});

export const emptySpaceComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.emptySpaceComponent(),
  render: EmptySpace,
  options: [backgroundColorOption()],
  ...props,
});

export const titleComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.titleComponent(),
  render: Title,
  options: [backgroundColorOption()],
  ...props,
});

export const textComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.textComponent(),
  render: TextComponent,
  options: [backgroundColorOption()],
  ...props,
});

export const imageComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.imageComponent(),
  render: Image,
  options: [backgroundColorOption()],
  ...props,
});

export const buttonComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.buttonComponent(),
  render: Button,
  options: [backgroundColorOption()],
  ...props,
});

export const foldableComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.foldableComponent(),
  options: [dragOption(), collapseOption(), backgroundColorOption()],
  render: Foldable,
  ...props,
});

export const clickableComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.clickableComponent(),
  render: Clickable,
  options: [dragOption(), collapseOption(), backgroundColorOption()],
  ...props,
});

export const baseFields = (): ReactFieldObject[] => [
  textField(),
  textareaField(),
  selectField(),
  tagsField(),
  colorField(),
  imageField(),
  dateField(),
  toggleField(),
];

export const baseComponents = (): ReactComponentObject[] => [
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
  components: baseComponents(),
});

export const baseAddon = (
  { darkMode }: { darkMode?: boolean } = {}
): AddonObject => ({
  ...coreAddons.baseAddon({ darkMode }),
  components: [coreComponentsGroup()],
  fields: baseFields(),
  overrides: [],
});
