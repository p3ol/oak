import type { ComponentsGroupObject, AddonObject } from '@oakjs/core';
import {
  type TextFieldProps,
  type SelectFieldProps,
  type ColorFieldProps,
  type ToggleProps,
  type DateFieldProps,
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
  classNames,
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
      container={editableRef.current?.innerRef.current as HTMLDivElement}
    />
  ),
  ...props,
});

export const colorField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.colorField(),
  render: (fieldProps: ColorFieldProps, { setting, editableRef, t } = {}) => (
    <ColorField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      container={editableRef.current?.innerRef.current as HTMLDivElement}
    />
  ),
  ...props,
});

export const imageField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.imageField(),
  render: (fieldProps: ImageFieldProps, { setting, element }) => (
    <ImageField
      { ...fieldProps }
      className={classNames(fieldProps?.className, setting?.props?.className)}
      iconOnly={setting?.props?.iconOnly}
      setting={setting}
      element={element}
    />
  ),
  ...props,
});

export const dateField = (props?: ReactFieldObject): ReactFieldObject => ({
  ...coreAddons.dateField(),
  render: (fieldProps: DateFieldProps, { setting, editableRef, t } = {}) => (
    <DateField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      container={editableRef.current?.innerRef.current as HTMLDivElement}
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
): ReactComponentObject => ({
  ...coreAddons.rowComponent(),
  render: Row,
  options: [dragOption(), backgroundColorOption()],
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
  ...props,
});

export const titleComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.titleComponent(),
  render: Title,
  ...props,
});

export const textComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.textComponent(),
  render: TextComponent,
  ...props,
});

export const imageComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.imageComponent(),
  render: Image,
  ...props,
});

export const buttonComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.buttonComponent(),
  render: Button,
  ...props,
});

export const foldableComponent = (
  props?: ReactComponentObject
): ReactComponentObject => ({
  ...coreAddons.foldableComponent(),
  options: [dragOption()],
  render: Foldable,
  ...props,
});

export const baseFields = (): ReactFieldObject[] => [
  textField(),
  textareaField(),
  selectField(),
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
];

export const coreComponentsGroup = (): ComponentsGroupObject => ({
  ...coreAddons.coreComponentsGroup(),
  components: baseComponents(),
});

export const baseAddon = (): AddonObject => ({
  ...coreAddons.baseAddon(),
  components: [coreComponentsGroup()],
  fields: baseFields(),
  overrides: [{
    type: 'setting',
    targets: ['*'],
    key: 'styles.backgroundImage',
    props: {
      iconOnly: true,
      className: 'oak-mr-4 oak-relative oak-top-[2px]',
    },
  }],
});
