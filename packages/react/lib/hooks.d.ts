import { AddonObject, Builder, BuilderOptions, ElementObject, Logger } from '@oakjs/core';

import { BuilderContextValue } from './Builder';

export declare function useRootBuilder(opts?: Partial<BuilderOptions & {
  defaultContent?: Array<ElementObject | Element>;
  activeTextSheet?: string;
  addons?: Array<AddonObject>;
  content?: Array<ElementObject | Element>;
  onChange?(content: Array<ElementObject | Element>): void;
}>): {
  builder: Builder;
  content: Array<ElementObject | Element>;
  activeTextSheet: string;
  canUndo: boolean;
  canRedo: boolean;
  addons: Array<AddonObject>;
};

export declare function useBuilder(): BuilderContextValue;

export declare function useLogger(): Logger;
