import type { RendererComponentProps } from '../../types';
import {
  containerAttributes,
  getColClasses,
  mergeAttributes,
} from '../../utils';

const Col = ({ element, attributes, renderContainer }: RendererComponentProps) => (
  <div
    { ...mergeAttributes(attributes, {
      className: getColClasses(element),
    }) }
    { ...containerAttributes('content') }
  >
    { renderContainer('content') }
  </div>
);

Col.displayName = 'ColRenderer';
Col.oakHandlesResponsive = true;

export default Col;
