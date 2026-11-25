import * as Y from 'yjs';
import type { ElementObject } from '@oakjs/core';

import { getTextChange } from '../textChanges';

/*
 * Content is stored in Yjs as nested shared types: arrays become Y.Array,
 * objects become Y.Map, texts become Y.Text and other values are stored as
 * is. Local changes are applied with the smallest possible operations (only
 * changed values, or characters for texts, are written), so that concurrent
 * changes made by other users are kept.
 */

// Values identifying elements are stored as plain values, never merged
const PLAIN_KEYS = ['id', 'type'];

const isPlainObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value) &&
  !(value instanceof Y.AbstractType);

const toJSON = (value: unknown) =>
  value instanceof Y.AbstractType ? value.toJSON() : value;

const isEqual = (a: unknown, b: unknown) =>
  a === b || JSON.stringify(toJSON(a)) === JSON.stringify(b);

/**
 * Converts a JSON value into Yjs shared types. Strings stored in objects
 * become Y.Text so that concurrent typing is merged character by character.
 */
export const toYValue = (value: unknown, key?: string): unknown => {
  if (Array.isArray(value)) {
    const array = new Y.Array();
    array.insert(0, value.map(v => toYValue(v)));

    return array;
  }

  if (isPlainObject(value)) {
    const map = new Y.Map();
    Object.entries(value).forEach(([k, v]) => {
      if (v !== undefined) {
        map.set(k, toYValue(v, k));
      }
    });

    return map;
  }

  if (typeof value === 'string' && key && !PLAIN_KEYS.includes(key)) {
    return new Y.Text(value);
  }

  return value;
};

/** Applies a new value to a Y.Text, only writing the changed characters */
export const syncText = (text: Y.Text, value: string) => {
  const change = getTextChange(text.toString(), value);

  if (!change) {
    return;
  }

  if (change.end > change.start) {
    text.delete(change.start, change.end - change.start);
  }

  if (change.insert) {
    text.insert(change.start, change.insert);
  }
};

/** Removes undefined values & functions, like a JSON serialization would */
export const normalize = <T>(value: T): T =>
  value === undefined ? value : JSON.parse(JSON.stringify(value));

/** Applies a JSON object onto a Y.Map, only writing what changed */
export const syncMap = (map: Y.Map<any>, value: Record<string, any>) => {
  Array.from(map.keys()).forEach(key => {
    if (value[key] === undefined) {
      map.delete(key);
    }
  });

  Object.entries(value).forEach(([key, v]) => {
    if (v === undefined) {
      return;
    }

    const current = map.get(key);

    if (isPlainObject(v) && current instanceof Y.Map) {
      syncMap(current, v);
    } else if (Array.isArray(v) && current instanceof Y.Array) {
      syncArray(current, v);
    } else if (typeof v === 'string' && current instanceof Y.Text) {
      syncText(current, v);
    } else if (!isEqual(current, v)) {
      map.set(key, toYValue(v, key));
    }
  });
};

const getId = (item: unknown) =>
  item instanceof Y.Map ? item.get('id') : (item as any)?.id;

const hasIds = (values: unknown[]) =>
  values.every(v => isPlainObject(v) && v.id !== undefined && v.id !== null);

/**
 * Applies a JSON array onto a Y.Array. Arrays of elements (objects with an
 * `id`) are synchronized by id: elements are updated in place, inserted,
 * removed or moved. Other arrays are replaced when they changed.
 */
export const syncArray = (array: Y.Array<any>, value: unknown[]) => {
  if (!value.length || !hasIds(value)) {
    if (!isEqual(array, value)) {
      array.delete(0, array.length);
      array.insert(0, value.map(v => toYValue(v)));
    }

    return;
  }

  const ids = value.map(v => String((v as ElementObject).id));

  // Removed elements
  for (let i = array.length - 1; i >= 0; i--) {
    if (!ids.includes(String(getId(array.get(i))))) {
      array.delete(i, 1);
    }
  }

  value.forEach((element, i) => {
    const current = i < array.length ? array.get(i) : undefined;

    if (current instanceof Y.Map && String(getId(current)) === ids[i]) {
      syncMap(current, element as Record<string, any>);

      return;
    }

    // Moved elements are re-created at their new position (Yjs has no move
    // operation)
    for (let j = i + 1; j < array.length; j++) {
      if (String(getId(array.get(j))) === ids[i]) {
        array.delete(j, 1);
        break;
      }
    }

    array.insert(i, [toYValue(element)]);
  });

  if (array.length > value.length) {
    array.delete(value.length, array.length - value.length);
  }
};

export declare interface YjsKeys {
  /** Name of the Y.Array storing the content (default: `oak:content`) */
  contentKey?: string;
  /** Name of the Y.Map storing the page settings (default: `oak:page`) */
  pageKey?: string;
}

export const getYContent = (doc: Y.Doc, { contentKey = 'oak:content' } = {}) =>
  doc.getArray<any>(contentKey);

export const getYPage = (doc: Y.Doc, { pageKey = 'oak:page' } = {}) =>
  doc.getMap<any>(pageKey);

/**
 * Replaces the content stored in a Y.Doc (e.g. to initialize it on a server,
 * or before connecting a provider)
 */
export const setYjsContent = (
  doc: Y.Doc,
  content: ElementObject[],
  { origin, ...keys }: YjsKeys & { origin?: unknown } = {},
) => {
  doc.transact(() => {
    syncArray(getYContent(doc, keys), normalize(content));
  }, origin);
};

/** Returns the content stored in a Y.Doc */
export const getYjsContent = (doc: Y.Doc, keys: YjsKeys = {}) =>
  getYContent(doc, keys).toJSON() as ElementObject[];
