/**
 * Yjs binding for @oakjs/ash: `import { useYjs } from '@oakjs/ash/yjs'`.
 * Requires the `yjs` (and `y-protocols` for presence) peer dependencies.
 */
export {
  useYjs,
  type UseYjsOptions,
  type YjsBuilderProps,
  type YjsUser,
} from './useYjs';

export {
  setYjsContent,
  getYjsContent,
  syncArray,
  syncMap,
  syncText,
  toYValue,
  type YjsKeys,
} from './sync';
