import type {
  RefObject,
  Ref,
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react';
import type {
  AddonObject,
  Builder,
  ComponentObject,
  ComponentOptionObject,
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ComponentTabOject,
  ElementObject,
  FieldContent,
  FieldObject,
  FieldOverride,
  FieldOverrideObject,
  GetTextCallback,
  SettingOverride,
  SettingOverrideObject,
} from '@oakjs/core';
import type {
  ColorFieldProps,
  DateFieldProps,
  DroppableRef,
  SelectFieldProps,
  TextFieldProps,
  ToggleProps,
} from '@junipero/react';

import type { EditableRef } from './Editable';
import type { ImageFieldProps } from './fields';

export declare interface OakRef {
  isOak: boolean;
}

export declare type SpecialComponentPropsWithRef<
  T extends ElementType = any,
  R extends OakRef = any,
> = ComponentPropsWithoutRef<T> & {
  ref?: Ref<R>;
};

export declare type EditableType = 'floating' | 'modal';

export declare interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare interface CommonFieldProps {
  fieldOptions?: {
    onChange?: (name: string, field: FieldContent) => void;
    setting?: ComponentSettingsFieldObject;
    editableRef?: RefObject<EditableRef>;
    floatingsRef?: RefObject<HTMLDivElement>;
    element?: ElementObject | ElementObject[];
    field?: FieldObject;
    overrides?: ComponentOverrideObject | FieldOverrideObject |
      SettingOverrideObject | ComponentOverride | FieldOverride |
      SettingOverride;
    t?: GetTextCallback;
  };
}

export declare interface ReactFieldObject extends FieldObject {
  render?(
    props: (
      TextFieldProps | SelectFieldProps | ColorFieldProps | DateFieldProps |
      ImageFieldProps | ToggleProps
    ) & CommonFieldProps,
  ): ReactNode;
}

export declare interface CommonComponentProps {
  componentOptions?: {
    t?: GetTextCallback;
  };
}

export declare interface ReactComponentObject
  extends Omit<ComponentObject, 'options'> {
  options?: ReactComponentOptionObject[];
  render?(
    props: ComponentPropsWithoutRef<any> & CommonComponentProps,
  ): ReactNode;
}

export declare interface ReactComponentOptionObject
  extends ComponentOptionObject {
  render?(
    props: {
      element: ElementObject;
      builder: Builder;
      option: ComponentOptionObject;
      className: string;
      parent: ElementObject[];
      component: ReactComponentObject;
      index: number;
      elementInnerRef: RefObject<DroppableRef>;
      editableRef: RefObject<EditableRef>;
    },
  ): ReactNode;
}

export declare interface ReactComponentOverrideObject
  extends ComponentOverrideObject {
  render?(
    props: ComponentPropsWithoutRef<any> & CommonComponentProps,
  ): ReactNode;
}

export declare interface ReactComponentSettingsFieldObject
  extends ComponentSettingsFieldObject {
  display?: (value: any) => ReactNode;
}

export declare interface ReactFieldOverrideObject extends FieldOverrideObject {
  render?(
    props: (
      TextFieldProps | SelectFieldProps | ColorFieldProps | DateFieldProps |
      ImageFieldProps | ToggleProps
    ) & CommonFieldProps,
  ): ReactNode;
}

export declare interface ReactAddonObject extends AddonObject {
  components?: (ReactComponentObject | ComponentTabOject)[];
  fields?: ReactFieldObject[];
  overrides?: (
    ReactComponentOverrideObject |
    ReactFieldOverrideObject |
    SettingOverrideObject
  )[];
}

export declare type SerializeMethod =
  ({key: string, method: (data: any) => any});
