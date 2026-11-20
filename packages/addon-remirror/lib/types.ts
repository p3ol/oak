import type {
  BoldExtension,
  FontSizeExtension,
  ItalicExtension,
  LinkExtension,
  NodeFormattingExtension,
  TextColorExtension,
  UnderlineExtension,
} from 'remirror/extensions';

import type { CollaborationFieldOptions } from './Field/types';

export type Extensions =
  | BoldExtension
  | ItalicExtension
  | UnderlineExtension
  | LinkExtension
  | TextColorExtension
  | FontSizeExtension
  | NodeFormattingExtension;

export type GetTextCallback = (key: string, def?: string) => string;

/**
 * Options given to fields by oak builders (`@oakjs/react`, `@oakjs/ash`)
 */
export declare interface FieldOptions extends CollaborationFieldOptions {
  t?: GetTextCallback;
  [key: string]: any;
}
