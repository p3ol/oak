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

import type { ImageUploadCallbackResult } from './types';

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
};

export const BuilderContext = createContext<BuilderContextValue>({});
