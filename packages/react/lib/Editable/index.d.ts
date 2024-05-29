import type {
  ReactNode,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  MutableRefObject,
} from 'react';
import type {
  Component,
  ComponentObject,
  ComponentSettingsField,
  ComponentSettingsFieldKeyTuple,
  ComponentSettingsFieldObject,
  ComponentSettingsTab,
  ComponentSettingsTabObject,
  ElementObject,
  FieldContent,
  FieldOverride,
  FieldOverrideObject,
} from '@oakjs/core';

export declare interface EditableProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  element?: ElementObject;
  component?: ComponentObject | Component;
  onToggle?(props: { opened: boolean }): void;
}

declare function Editable(props: EditableProps): ReactNode | JSX.Element;

export default Editable;

export declare interface FormProps extends ComponentPropsWithoutRef<any> {
  placement?: string;
  element?: ElementObject;
  component?: ComponentObject | Component;
  className?: string;
  onSave?(): void;
  onCancel?(): void;
  editableRef?: MutableRefObject<any>;
}

export declare function Form(props: FormProps): ReactNode | JSX.Element;

export declare interface FieldProps extends ComponentPropsWithoutRef<any> {
  setting?: ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject;
  element?: ElementObject;
  component?: ComponentObject | Component;
  overrides?: FieldOverrideObject | FieldOverride;
  onChange?(
    key: string | ComponentSettingsFieldKeyTuple,
    field: { value: FieldContent; valid: boolean }
  ): void;
  onCustomChange?(
    key: string | ComponentSettingsFieldKeyTuple,
    overrides: FieldOverrideObject | FieldOverride,
    field: { value: FieldContent; valid: boolean }
  ): void;
  editableRef: MutableRefObject<any>;
}

export declare function Field(props: FieldProps): ReactNode | JSX.Element;
