import { AddonObject, Builder, ComponentSettingsField, ElementObject } from '@oakjs/core';
import { ChangeEvent, MutableRefObject, createContext } from 'react';

import { ImageUploadCallbackResult } from './Builder';

declare type BuilderContextType = {
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
      setting?: ComponentSettingsField;
    }): Promise<ImageUploadCallbackResult>;
    rootRef?: MutableRefObject<HTMLElement>;
    floatingsRef?:
      MutableRefObject<HTMLElement>[] |
      MutableRefObject<HTMLElement>;
};
export const BuilderContext = createContext<BuilderContextType>({});
