import {
  type ChangeEvent,
  type RefObject,
  createContext,
} from 'react';
import type {
  AddonObject,
  Builder,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';

import type { EditableType, ImageUploadCallbackResult } from './types';

export declare interface BuilderContextValue {
  builder?: Builder;
  content?: ElementObject[];
  addons?: AddonObject[];
  rootBoundary?:
    | RefObject<HTMLElement>
    | string
    | Element
    | DocumentFragment;
  boundary?:
    RefObject<HTMLElement> |
    string |
    Element |
    DocumentFragment;
  onImageUpload?(event: ChangeEvent<HTMLInputElement>, opts?: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): ImageUploadCallbackResult | Promise<ImageUploadCallbackResult>;
  rootRef?: RefObject<HTMLDivElement>;
  floatingsRef?: RefObject<HTMLDivElement>;
  editableType?: EditableType;
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
};

export const BuilderContext = createContext<BuilderContextValue>({});

export declare interface EditableFormContextValue {
  element?: ElementObject;
  seed?: string | number;
  setSeed?(seed: string | number): void;
}

export const EditableFormContext = createContext<EditableFormContextValue>({});

export declare interface ElementContextValue {
  element?: ElementObject;
  collapsed?: boolean;
  toggleCollapse?: () => void;
}

export const ElementContext = createContext<ElementContextValue>({});
