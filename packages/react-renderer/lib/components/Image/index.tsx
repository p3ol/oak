import type { CSSProperties } from 'react';

import type { RendererComponentProps } from '../../types';
import { mergeAttributes, toCSSUnit } from '../../utils';

const Image = ({
  element,
  attributes,
  editing,
  dark,
}: RendererComponentProps) => {
  const size = element.settings?.size || 'auto';
  const imageStyle: CSSProperties = size === 'custom'
    ? {
      width: toCSSUnit(element.settings?.width),
      height: toCSSUnit(element.settings?.height),
      maxWidth: '100%',
    }
    : size === 'full'
      ? { maxWidth: 'none' }
      : { maxWidth: '100%', height: 'auto' };

  return (
    <div
      { ...mergeAttributes(attributes, {
        style: { textAlign: element.settings?.textAlign || 'left' },
      }) }
    >
      { element.url ? (
        <img
          className="oak:inline-block oak:align-middle"
          src={element.url}
          alt={element.settings?.alt || ''}
          title={element.settings?.description || undefined}
          style={imageStyle}
          draggable={editing ? false : undefined}
        />
      ) : editing ? (
        <div
          className={
            'oak:inline-flex oak:items-center oak:justify-center ' +
            'oak:w-full oak:h-32 oak:text-sm ' +
            (dark
              ? 'oak:bg-[#262626] oak:text-[#9097A3]'
              : 'oak:bg-[#F3F3F3] oak:text-[#6B778C]')
          }
        >
          No image
        </div>
      ) : null }
    </div>
  );
};

Image.displayName = 'ImageRenderer';

export default Image;
