import type { RendererComponentProps } from '../../types';
import HTMLContent from '../HTMLContent';

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const Title = ({ element, attributes, sanitizeHTML }: RendererComponentProps) => (
  <HTMLContent
    { ...attributes }
    tag={HEADINGS.includes(element.headingLevel) ? element.headingLevel : 'h1'}
    html={element.content as string}
    sanitizeHTML={sanitizeHTML}
  />
);

Title.displayName = 'TitleRenderer';

export default Title;
