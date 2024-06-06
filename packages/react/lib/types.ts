import type { ComponentProps, MutableRefObject, ReactNode } from 'react';
import type {
  ComponentObject,
  ComponentSettingsFieldObject,
  ElementObject,
  FieldObject,
  GetTextCallback,
} from '@oakjs/core';
import type {
  ColorFieldProps,
  DateFieldProps,
  SelectFieldProps,
  TextFieldProps,
  ToggleProps,
} from '@junipero/react';

import type { EditableRef } from './Editable';
import type { ImageFieldProps } from './fields';

export declare interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare interface ReactFieldObject extends FieldObject {
  render?(
    props:
      | TextFieldProps
      | SelectFieldProps
      | ColorFieldProps
      | DateFieldProps
      | ImageFieldProps
      | ToggleProps,
    opts?: {
      setting?: ComponentSettingsFieldObject;
      editableRef?: MutableRefObject<EditableRef>;
      element?: ElementObject | ElementObject[];
      t?: GetTextCallback;
    },
  ): ReactNode;
}

export declare interface ReactComponentObject extends ComponentObject {
  render?(
    props: ComponentProps<any>,
    opts?: {
      t?: GetTextCallback;
    },
  ): ReactNode;
}
