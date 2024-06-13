import type { ComponentProps, MutableRefObject, ReactNode } from 'react';
import type {
  Builder,
  ComponentObject,
  ComponentOptionObject,
  ComponentSettingsFieldObject,
  ElementObject,
  FieldObject,
  GetTextCallback,
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

export declare interface ReactComponentObject
  extends Omit<ComponentObject, 'options'> {
  options?: ReactComponentOptionObject[];
  render?(
    props: ComponentProps<any>,
    opts?: {
      t?: GetTextCallback;
    },
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
