export function assignDefined<T> (
  target: T,
  ...sources: any[]
): T {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key in source) {
      if (typeof source[key] !== 'undefined') {
        // @ts-expect-error it's obviously any
        target[key] = source[key];
      }
    }
  }

  return target;
}
