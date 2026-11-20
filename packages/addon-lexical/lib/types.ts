import type { CollaborationFieldOptions } from './Field/types';

export type GetTextCallback = (key: string, def?: string) => string;

/**
 * Options given to fields by oak builders (`@oakjs/react`, `@oakjs/ash`)
 */
export declare interface FieldOptions extends CollaborationFieldOptions {
  t?: GetTextCallback;
  floatingsRef?: { current?: HTMLElement | null };
  [key: string]: any;
}

/** Toolbar items, in the same spirit as CKEditor's (`|` is a separator) */
export declare type LexicalToolbarItem =
  | '|'
  | 'undo'
  | 'redo'
  | 'heading'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'underline'
  | 'link'
  | 'fontColor'
  | 'fontSize'
  | 'bulletedList'
  | 'numberedList'
  | 'removeFormat'
  | 'outdent'
  | 'indent'
  | 'alignment'
  | 'horizontalLine'
  | 'blockQuote'
  | 'insertTable';

export declare interface LexicalFontSize {
  label: string;
  /** Any css font size, `null` removes the font size */
  value: string | null;
}
