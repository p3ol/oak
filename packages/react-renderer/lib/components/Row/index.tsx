import type { RendererComponentProps } from '../../types';
import { containerAttributes, mergeAttributes, toCSSUnit } from '../../utils';

const Row = ({ element, attributes, renderContainer }: RendererComponentProps) => {
  const gap = toCSSUnit(element.settings?.gap);
  const direction = element.settings?.flexDirection || 'row';

  return (
    <div
      { ...mergeAttributes(attributes, {
        className: 'oak:flex oak:flex-wrap oak:w-full',
        style: {
          flexDirection: direction,
          justifyContent: element.settings?.justifyContent,
          alignItems: element.settings?.alignItems ||
            (/column/.test(direction) ? 'stretch' : 'flex-start'),
          ...gap && {
            gap,
            ['--oak-col-gap' as string]: gap,
          },
        },
      }) }
      { ...containerAttributes('cols') }
    >
      { renderContainer('cols') }
    </div>
  );
};

Row.displayName = 'RowRenderer';

export default Row;
