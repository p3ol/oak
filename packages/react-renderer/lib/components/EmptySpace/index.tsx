import type { RendererComponentProps } from '../../types';
import { mergeAttributes, toCSSUnit } from '../../utils';

const EmptySpace = ({ element, attributes }: RendererComponentProps) => (
  <div
    { ...mergeAttributes(attributes, {
      style: { height: toCSSUnit(element.settings?.height) || '32px' },
    }) }
  />
);

EmptySpace.displayName = 'EmptySpaceRenderer';

export default EmptySpace;
