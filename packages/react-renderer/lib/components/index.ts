import type { RendererComponentsMap } from '../types';
import Button from './Button';
import Clickable from './Clickable';
import Col from './Col';
import EmptySpace from './EmptySpace';
import Foldable from './Foldable';
import Image from './Image';
import Row from './Row';
import Text from './Text';
import Title from './Title';

export {
  Button,
  Clickable,
  Col,
  EmptySpace,
  Foldable,
  Image,
  Row,
  Text,
  Title,
};

export { default as HTMLContent, type HTMLContentProps } from './HTMLContent';

/**
 * Renderers for oak's base components, keyed by component id
 */
export const baseComponents = (): RendererComponentsMap => ({
  row: Row,
  col: Col,
  'empty-space': EmptySpace,
  title: Title,
  text: Text,
  image: Image,
  button: Button,
  foldable: Foldable,
  clickable: Clickable,
});
