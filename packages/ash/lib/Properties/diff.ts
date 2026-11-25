const isPlainObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const isEqual = (a: unknown, b: unknown) =>
  a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * Returns the paths (as arrays of keys) of the values that differ between two
 * objects. Plain objects are compared recursively, other values (including
 * arrays) are compared as a whole.
 */
export const getChangedPaths = (
  base: Record<string, any> = {},
  next: Record<string, any> = {},
  prefix: string[] = [],
): string[][] => {
  const keys = new Set([...Object.keys(base || {}), ...Object.keys(next || {})]);
  const paths: string[][] = [];

  keys.forEach(key => {
    const a = base?.[key];
    const b = next?.[key];

    // A missing object is compared as an empty one, so that only the values
    // that were actually added are returned
    if (
      (isPlainObject(a) || a === undefined || a === null) &&
      isPlainObject(b)
    ) {
      paths.push(...getChangedPaths(a || {}, b, [...prefix, key]));
    } else if (!isEqual(a, b)) {
      paths.push([...prefix, key]);
    }
  });

  return paths;
};

const clone = <T>(value: T): T =>
  value === undefined ? value : JSON.parse(JSON.stringify(value));

/**
 * Builds the top-level updates applying the given changed paths of `next` on
 * top of `target`: nested values of `target` that were not changed are kept.
 */
export const getUpdates = (
  target: Record<string, any>,
  next: Record<string, any>,
  paths: string[][],
): Record<string, any> => {
  const updates: Record<string, any> = {};

  paths.forEach(path => {
    const [top, ...rest] = path;
    let value = next;
    path.forEach(key => { value = value?.[key]; });

    if (!rest.length) {
      updates[top] = clone(value);

      return;
    }

    if (!isPlainObject(updates[top])) {
      updates[top] = isPlainObject(target?.[top]) ? clone(target[top]) : {};
    }

    let node = updates[top];
    rest.slice(0, -1).forEach(key => {
      if (!isPlainObject(node[key])) {
        node[key] = {};
      }

      node = node[key];
    });
    node[rest[rest.length - 1]] = clone(value);
  });

  return updates;
};

export const getIn = (value: any, path: string[]) =>
  path.reduce((v, key) => v?.[key], value);

export const setIn = (target: any, path: string[], value: unknown) => {
  let node = target;

  path.slice(0, -1).forEach(key => {
    if (!isPlainObject(node[key])) {
      node[key] = {};
    }

    node = node[key];
  });

  node[path[path.length - 1]] = clone(value);
};

const isPrefix = (a: string[], b: string[]) =>
  a.length <= b.length && a.every((key, i) => b[i] === key);

/** Whether two paths target the same value (or one contains the other) */
export const arePathsRelated = (a: string[], b: string[]) =>
  isPrefix(a, b) || isPrefix(b, a);
