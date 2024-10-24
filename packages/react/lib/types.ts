import type { ComponentProps, MutableRefObject, ReactNode } from 'react';
import type {
  Builder,
  ComponentObject,
  ComponentOptionObject,
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
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
    editableRef?: MutableRefObject<EditableRef>;
    floatingsRef?: MutableRefObject<HTMLDivElement>;
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
    props: ComponentProps<any> & CommonComponentProps,
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
      elementInnerRef: MutableRefObject<DroppableRef>;
      editableRef: MutableRefObject<EditableRef>;
    },
  ): ReactNode;
}
