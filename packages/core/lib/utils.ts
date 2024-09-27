export function assignDefined<T extends any> (
  target: T,
  ...sources: Array<any>
): T {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key in source) {
      if (typeof source[key] !== 'undefined') {
        // @ts-ignore it's obviously any
        target[key] = source[key];
      }
    }
  }

  return target;
}
