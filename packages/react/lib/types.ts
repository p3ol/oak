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

export declare type EditableType = 'floating' | 'modal';

export declare interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare interface CommonFieldProps {
  fieldOptions?: {
    setting?: ComponentSettingsFieldObject;
    editableRef?: MutableRefObject<EditableRef>;
    element?: ElementObject | ElementObject[];
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
