/**
 * Single contiguous change between two strings: `a.slice(start, end)` was
 * replaced by `insert`. Typing produces such changes, which is enough to merge
 * concurrent edits made at different places.
 */
export declare interface TextChange {
  start: number;
  /** End of the replaced range, in the original string */
  end: number;
  insert: string;
}

export const getTextChange = (a: string, b: string): TextChange | null => {
  if (a === b) {
    return null;
  }

  let start = 0;
  const max = Math.min(a.length, b.length);

  while (start < max && a[start] === b[start]) {
    start++;
  }

  let endA = a.length;
  let endB = b.length;

  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }

  return { start, end: endA, insert: b.slice(start, endB) };
};

export const applyTextChange = (text: string, change: TextChange | null) =>
  change
    ? text.slice(0, change.start) + change.insert + text.slice(change.end)
    : text;

/**
 * Merges two versions of a text edited concurrently from the same `base`.
 * Changes made at different places are both kept, overlapping changes are
 * resolved in favor of `local`.
 */
export const mergeText = (base: string, local: string, remote: string) => {
  const l = getTextChange(base, local);
  const r = getTextChange(base, remote);

  if (!l) {
    return remote;
  }

  if (!r) {
    return local;
  }

  // Remote change after the local one (or the opposite): apply the last one
  // first so that the positions of the first one stay valid
  if (l.end <= r.start && !(l.start === l.end && l.start === r.start)) {
    return applyTextChange(applyTextChange(base, r), l);
  }

  if (r.end <= l.start) {
    return applyTextChange(applyTextChange(base, l), r);
  }

  return local;
};

/**
 * Where a position (e.g. the caret) ends up when `a` is changed into `b`
 */
export const mapTextPosition = (position: number, a: string, b: string) => {
  const change = getTextChange(a, b);

  if (!change || position <= change.start) {
    return position;
  }

  if (position >= change.end) {
    return position + change.insert.length - (change.end - change.start);
  }

  return change.start + change.insert.length;
};
