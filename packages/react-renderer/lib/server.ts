/**
 * Server-capable entrypoint (`@oakjs/react-renderer/server`).
 *
 * Contains the renderers that don't use state, effects or event handlers, as
 * well as every helper, so that they can be used inside React Server
 * Components. Unlike the main entrypoint, this one is NOT marked with
 * `'use client'`.
 *
 * Interactive renderers (button, foldable, clickable) are only exported by
 * the main entrypoint (`@oakjs/react-renderer`, marked with `'use client'`).
 * From a server component, render their children first and pass them to a
 * client component of your own, which gives `renderContainer` to them.
 */
import type { RendererComponentsMap } from './types';
import Col from './components/Col';
import EmptySpace from './components/EmptySpace';
import Image from './components/Image';
import Row from './components/Row';
import Text from './components/Text';
import Title from './components/Title';

export {
  Col,
  EmptySpace,
  Image,
  Row,
  Text,
  Title,
};

export {
  default as HTMLContent,
  type HTMLContentProps,
} from './components/HTMLContent';

/**
 * Server-capable renderers of oak's base components, keyed by component id
 * (see `baseComponents()` for every renderer, including interactive ones)
 */
export const serverComponents = (): RendererComponentsMap => ({
  row: Row,
  col: Col,
  'empty-space': EmptySpace,
  title: Title,
  text: Text,
  image: Image,
});

export * from './utils';

export type * from './types';
