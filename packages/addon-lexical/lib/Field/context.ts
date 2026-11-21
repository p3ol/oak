import { createContext, use } from 'react';

import type { GetTextCallback } from '../types';

export declare interface LexicalFieldContextValue {
  t: GetTextCallback;
  /**
   * Where to render dropdown menus, so that they're not clipped by the
   * field's container (e.g. a scrollable sidebar)
   */
  container?: HTMLElement;
}

export const LexicalFieldContext = createContext<LexicalFieldContextValue>({
  t: (_, def) => def,
});

/**
 * Field-level context, so that the field doesn't depend on a specific
 * builder's context (`@oakjs/react` or `@oakjs/ash`)
 */
export const useLexicalField = () => use(LexicalFieldContext);
