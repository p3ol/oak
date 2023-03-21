export const copyToClipboard = value =>
  globalThis.navigator.clipboard.writeText(value);
