import crypto from 'node:crypto';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});

const clipboard = {
  data: '',
};

Object.defineProperty(globalThis.navigator, 'clipboard', {
  value: {
    _: clipboard,
    writeText: val => { clipboard.data = val; },
    readText: () => Promise.resolve(clipboard.data),
  },
});

globalThis.ResizeObserver = class ResizeObserver {
  observe () {
    // No-op for testing purposes
  }
  unobserve () {
    // No-op for testing purposes
  }
  disconnect () {
    // No-op for testing purposes
  }
};
