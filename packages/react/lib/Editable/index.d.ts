import {
  ReactNode,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  MutableRefObject,
} from 'react';
import {
  ElementObject,
  Element,
  ComponentObject,
  Component,
  ComponentSettingsField,
  ComponentSettingGroupObject,
  ComponentSettingsFieldObject,
  ComponentSettingsFieldKeyTuple,
  FieldOverrideObject,
  FieldOverride,
} from '@oakjs/core';

export declare interface EditableProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  element?: ElementObject | Element;
  component?: ComponentObject | Component;
  onToggle?(props: { opened: boolean });
}

declare function Editable(props: EditableProps): ReactNode | JSX.Element;

export default Editable;

export declare interface FormProps extends ComponentPropsWithoutRef<any> {
  placement?: string;
  element?: ElementObject | Element;
  component?: ComponentObject | Component;
  className?: string;
  onSave?(): void;
  onCancel?(): void;
  editableRef?: MutableRefObject<any>;
}

export declare function Form(props: FormProps): ReactNode | JSX.Element;

export declare interface FieldProps extends ComponentPropsWithoutRef<any> {
  setting?: ComponentSettingGroupObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject;
  element?: ElementObject | Element;
  component?: ComponentObject | Component;
  overrides?: FieldOverrideObject | FieldOverride;
  onChange?(
    key: string | ComponentSettingsFieldKeyTuple,
    field: { value: any; valid: boolean }
  ): void;
  onCustomChange?(
    key: string | ComponentSettingsFieldKeyTuple,
    overrides: FieldOverrideObject | FieldOverride,
    field: { value: any; valid: boolean }
  ): void;
  editableRef: MutableRefObject<any>;
}

export declare function Field(props: FieldProps): ReactNode | JSX.Element;
