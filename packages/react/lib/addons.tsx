import {
  type TextFieldProps,
  type SelectFieldProps,
  type ColorFieldProps,
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
  DateFieldProps,
  ToggleProps,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import * as coreAddons from '@oakjs/core/addons';

import type { ReactComponentObject, ReactFieldObject } from './types';
import { dragOption, backgroundColorOption } from './options';
import { type ImageFieldProps, ImageField } from './fields';
import {
  Button,
  Col,
  EmptySpace,
  Foldable,
  Image,
  Row,
  Text as TextComponent,
  Title,
} from './components';
import Text from './Text';

export const textField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.textField(),
  render: (fieldProps: TextFieldProps, { setting, t } = {}) => (
    <TextField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      type={setting.valueType || 'text'}
    />
  ),
  ...props,
});

export const textareaField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.textareaField(),
  render: (fieldProps: TextFieldProps, { setting, t } = {}) => (
    <TextField
      { ...fieldProps }
      tag="textarea"
      rows={fieldProps.rows || 5}
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      type={setting.valueType || 'text'}
    />
  ),
  ...props,
});

export const selectField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.selectField(),
  render: (fieldProps: SelectFieldProps, { setting, editableRef, t } = {}) => (
    <SelectField
      clearable={false}
      { ...fieldProps }
      options={setting.options}
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      animateMenu={slideInDownMenu}
      parseTitle={setting.parseTitle || (o => o?.title ? t(o.title) : o)}
      parseValue={setting.parseValue || (o => o?.value ?? o)}
      container={editableRef.current}
    />
  ),
  ...props,
});

export const colorField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.colorField(),
  render: (fieldProps: ColorFieldProps, { setting, t } = {}) => (
    <ColorField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
  ...props,
});

export const imageField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.imageField(),
  render: (fieldProps: ImageFieldProps, { setting, element }) => (
    <ImageField
      { ...fieldProps }
      iconOnly={setting?.props?.iconOnly}
      setting={setting}
      element={element}
    />
  ),
  ...props,
});

export const dateField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.dateField(),
  render: (fieldProps: DateFieldProps, { setting, t } = {}) => (
    <DateField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
  ...props,
});

export const toggleField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.toggleField(),
  render: (fieldProps: ToggleProps, { setting } = {}) => (
    <Toggle { ...fieldProps } checked={fieldProps.value}>
      <Text>
        { fieldProps.value
          ? setting.checkedLabel
          : setting.uncheckedLabel }
      </Text>
    </Toggle>
  ),
  ...props,
});

export const rowComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.rowComponent(),
  render: Row,
  options: [dragOption(), backgroundColorOption()],
  ...props,
});

export const colComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.colComponent(),
  render: Col,
  ...props,
});

export const emptySpaceComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.emptySpaceComponent(),
  render: EmptySpace,
  ...props,
});

export const titleComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.titleComponent(),
  render: Title,
  ...props,
});

export const textComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.textComponent(),
  render: TextComponent,
  ...props,
});

export const imageComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.imageComponent(),
  render: Image,
  ...props,
});

export const buttonComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.buttonComponent(),
  render: Button,
  ...props,
});

export const foldableComponent = (
  props?: ReactComponentObject
  // @ts-ignore TODO: fix this
): ReactComponentObject => ({
  ...coreAddons.foldableComponent(),
  options: [dragOption()],
  render: Foldable,
  ...props,
});

export const baseFields = () => [
  textField(),
  textareaField(),
  selectField(),
  colorField(),
  imageField(),
  dateField(),
  toggleField(),
];

export const baseComponents = () => [
  rowComponent(),
  colComponent(),
  emptySpaceComponent(),
  titleComponent(),
  textComponent(),
  imageComponent(),
  buttonComponent(),
  foldableComponent(),
];

export const coreComponentsGroup = () => ({
  ...coreAddons.coreComponentsGroup(),
  components: baseComponents(),
});

export const baseAddon = () => ({
  ...coreAddons.baseAddon(),
  components: [coreComponentsGroup()],
  fields: baseFields(),
});
