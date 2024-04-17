import { get, set } from '@junipero/core';

import Emitter from '../Emitter';
import { GetTextCallback, TextsSheet, TextsSheetObject } from '../types';
import Builder from '../Builder';

export declare class ITexts {
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

export default class Texts extends Emitter implements ITexts {
  #sheets = [];
  #activeSheet = null;
  #builder = null;

  constructor ({ builder }: { builder?: Builder } = {}) {
    super();

    this.#builder = builder;
  }

  getSheet (id) {
    return this.#sheets.find(TextsSheet.FIND_PREDICATE(id));
  }

  addSheet (sheet) {
    sheet = new TextsSheet(sheet);
    const existing = this.getSheet(sheet.id);

    if (existing) {
      this.#builder.logger.log(
        'TextSheet already exists, updating definition.',
        'Old:', existing,
        'New:', sheet
      );

      const index = this.#sheets.indexOf(existing);
      this.#sheets[index] = sheet;
      this.emit('sheets.update', sheet);
    } else {
      this.#sheets.unshift(sheet);
      this.emit('sheets.add', sheet);
    }

    return sheet;
  }

  setSheet (sheet) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(sheet.id));

    if (index !== -1) {
      this.#sheets[index] = new TextsSheet(sheet);
      this.emit('sheets.update', sheet);
    }

    return sheet;
  }

  removeSheet (id) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(id));

    if (index !== -1) {
      const [sheet] = this.#sheets.splice(index, 1);
      this.emit('sheets.remove', sheet);

      return true;
    }

    return false;
  }

  getActiveSheet () {
    return this.#sheets[this.#activeSheet ?? 0]?.id;
  }

  setActiveSheet (id) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(id));

    if (index !== -1) {
      this.#activeSheet = index;
      this.emit('sheets.setActive', this.#sheets[index]);
    } else {
      this.#activeSheet = null;
      this.emit('sheets.setActive', null);
    }
  }

  get (key, def) {
    if (typeof key === 'function') {
      return key(this.get.bind(this));
    }

    const activeSheet = this.#sheets[this.#activeSheet];

    if (!activeSheet) {
      return def ?? key;
    }

    if (typeof key !== 'string') return def ?? key;

    return get(activeSheet.texts, key, def ?? key);
  }

  set (key, value) {
    const activeSheet = this.#sheets[this.#activeSheet ?? 0];

    if (!activeSheet) {
      this.#builder.logger.warn(
        'No TextSheet found, add a TextSheet before setting texts. Ignoring.');

      return;
    }

    if (typeof key === 'string') {
      set(activeSheet.texts, key, value);
      this.emit('texts.update', activeSheet, key, value);
    }
  }
}
