import {
  type ChangeEvent,
  type MutableRefObject,
  createContext,
} from 'react';
import type {
  AddonObject,
  Builder,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';

import type { EditableType, ImageUploadCallbackResult } from './types';

export declare type BuilderContextValue = {
  builder?: Builder;
  content?: ElementObject[];
  addons?: AddonObject[];
  rootBoundary?:
    MutableRefObject<HTMLElement> |
    string |
    Element |
    DocumentFragment;
  boundary?:
    MutableRefObject<HTMLElement> |
    string |
    Element |
    DocumentFragment;
  onImageUpload?(event: ChangeEvent<HTMLInputElement>, opts?: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): Promise<ImageUploadCallbackResult>;
  rootRef?: MutableRefObject<HTMLDivElement>;
  floatingsRef?: MutableRefObject<HTMLDivElement>;
  editableType?: EditableType;
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
};

export const BuilderContext = createContext<BuilderContextValue>({});

export declare type EditableFormContextValue = {
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
