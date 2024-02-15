import { ChangeEvent, Context, MutableRefObject } from 'react';
import {
  AddonObject,
  Builder,
  ComponentSettingsField,
  ElementObject,
} from '@oakjs/core';

export declare type BuilderContext = Context<{
  builder: Builder;
  content: ElementObject[];
  addons: AddonObject[];
  rootBoundary: MutableRefObject<HTMLElement>;
  onImageUpload(event: ChangeEvent<HTMLInputElement>, opts?: {
    element?: ElementObject;
    setting?: ComponentSettingsField;
  }): { name?: string; url?: string; };
  rootRef: MutableRefObject<HTMLElement>;
  floatingsRef: MutableRefObject<HTMLElement>[];
}>;
