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
  ComponentSettingField,
  ComponentSettingGroupObject,
  ComponentSettingFieldObject,
  ComponentSettingFieldKeyTuple,
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
    ComponentSettingField |
    ComponentSettingFieldObject;
  element?: ElementObject | Element;
  onChange?(
    key: string | ComponentSettingFieldKeyTuple,
    field: { value: any; valid: boolean }
  ): void;
  onCustomChange?(
    key: string | ComponentSettingFieldKeyTuple,
    overrides: FieldOverrideObject | FieldOverride,
    field: { value: any; valid: boolean }
  ): void;
  editableRef: MutableRefObject<any>;
}

export declare function Field(props: FieldProps): ReactNode | JSX.Element;
