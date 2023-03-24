import { get, set } from '@junipero/core';

import Emitter from '../Emitter';
import { TextsSheet } from '../types';

export default class Texts extends Emitter {
  #sheets = [];
  #activeSheet = null;
  #builder = null;

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
  }

  getSheet (id) {
    return this.#sheets.find(TextsSheet.FIND_PREDICATE(id));
  }

  addSheet (sheet) {
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
  }

  setSheet (sheet) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(sheet.id));

    if (index !== -1) {
      this.#sheets[index] = sheet;
      this.emit('sheets.update', sheet);
    }
  }

  removeSheet (id) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(id));

    if (index !== -1) {
      const sheet = this.#sheets[index];
      this.#sheets.splice(index, 1);
      this.emit('sheets.remove', sheet);
    }
  }

  getActiveSheet () {
    return this.#sheets[this.#activeSheet ?? 0]?.id;
  }

  setActiveSheet (id) {
    const index = this.#sheets.findIndex(TextsSheet.FIND_PREDICATE(id));

    if (index !== -1) {
      this.#activeSheet = index;
      this.emit('sheets.setActive', this.#sheets[index]);
    }
  }

  get (key, def) {
    const activeSheet = this.#sheets[this.#activeSheet];

    if (!activeSheet) {
      return def ?? key;
    }

    if (typeof key === 'function') {
      return key(this.get.bind(this));
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
