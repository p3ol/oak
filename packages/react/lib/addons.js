import {
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import * as coreAddons from '@oakjs/core/addons';

import { dragOption } from './options';
import ImageField from './fields/ImageField';
import Col from './components/Col';
import EmptySpace from './components/EmptySpace';
import Row from './components/Row';
import Title from './components/Title';
import TextComponent from './components/Text';
import Image from './components/Image';
import Button from './components/Button';
import Foldable from './components/Foldable';
import Text from './Text';

export const textField = (...props) => ({
  ...coreAddons.textField(),
  render: (fieldProps, { setting, t } = {}) => (
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

export const textareaField = (...props) => ({
  ...coreAddons.textareaField(),
  render: (fieldProps, { setting, t } = {}) => (
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

export const selectField = (...props) => ({
  ...coreAddons.selectField(),
  render: (fieldProps, { setting, editableRef, t } = {}) => (
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

export const colorField = (...props) => ({
  ...coreAddons.colorField(),
  render: (fieldProps, { setting, t } = {}) => (
    <ColorField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
  ...props,
});

export const imageField = (...props) => ({
  ...coreAddons.imageField(),
  render: (fieldProps, { setting }) => (
    <ImageField
      { ...fieldProps }
      iconOnly={setting?.props?.iconOnly}
    />
  ),
  ...props,
});

export const dateField = (...props) => ({
  ...coreAddons.dateField(),
  render: (fieldProps, { setting, t } = {}) => (
    <DateField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
  ...props,
});

export const toggleField = (...props) => ({
  ...coreAddons.toggleField(),
  render: (fieldProps, { setting } = {}) => (
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

export const rowComponent = (...props) => ({
  ...coreAddons.rowComponent(),
  render: Row,
  options: [dragOption()],
  ...props,
});

export const colComponent = (...props) => ({
  ...coreAddons.colComponent(),
  render: Col,
  ...props,
});

export const emptySpaceComponent = (...props) => ({
  ...coreAddons.emptySpaceComponent(),
  render: EmptySpace,
  ...props,
});

export const titleComponent = (...props) => ({
  ...coreAddons.titleComponent(),
  render: Title,
  ...props,
});

export const textComponent = (...props) => ({
  ...coreAddons.textComponent(),
  render: TextComponent,
  ...props,
});

export const imageComponent = (...props) => ({
  ...coreAddons.imageComponent(),
  render: Image,
  ...props,
});

export const buttonComponent = (...props) => ({
  ...coreAddons.buttonComponent(),
  render: Button,
  ...props,
});

export const foldableComponent = (...props) => ({
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
