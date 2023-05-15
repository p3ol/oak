import { TextsSheet, TextsSheetObject, GetTextCallback } from '../types';
import { Builder } from '../Builder';
import { Emitter } from '../Emitter';

export declare class Texts extends Emitter {
  constructor(options?: { builder: Builder });

  /** Retrieves a text sheet using its id */
  getSheet(id: string): TextsSheet;

  /** Adds a new texts sheet */
  addSheet(sheet: TextsSheetObject | TextsSheet): TextsSheet;

  /** Updates an existing text sheet */
  setSheet(sheet: TextsSheet): TextsSheet;

  /** Removes a text sheet */
  removeSheet(id: string): boolean;

  /** Retrieves the current active sheet id */
  getActiveSheet(): string;

  /** Sets the current active sheet id */
  setActiveSheet(id: string): void;

  /** Retrieves a text from the current active sheet */
  get(key: string | GetTextCallback, def?: any): any;

  /** Updates a text key in the current active sheet */
  set(key: string, value: any): void;
}
