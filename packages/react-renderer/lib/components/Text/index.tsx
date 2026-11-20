import type { RendererComponentProps } from '../../types';
import HTMLContent from '../HTMLContent';

const Text = ({ element, attributes, sanitizeHTML }: RendererComponentProps) => (
  <HTMLContent
    { ...attributes }
    html={element.content as string}
    sanitizeHTML={sanitizeHTML}
  />
);

Text.displayName = 'TextRenderer';

export default Text;
