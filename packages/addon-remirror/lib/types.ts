import type {
  BoldExtension,
  FontSizeExtension,
  ItalicExtension,
  LinkExtension,
  NodeFormattingExtension,
  TextColorExtension,
  UnderlineExtension,
} from 'remirror/extensions';

export type Extensions =
  | BoldExtension
  | ItalicExtension
  | UnderlineExtension
  | LinkExtension
  | TextColorExtension
  | FontSizeExtension
  | NodeFormattingExtension;
