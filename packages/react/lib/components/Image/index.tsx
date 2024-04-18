import { classNames } from '@junipero/react';
import { ComponentPropsWithoutRef } from 'react';

import Text from '../../Text';
import { ElementObject } from '../../../../core/lib/types';

declare interface ImageProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

const Image = ({
  element,
  className,
}: ImageProps) => {
  const getName = () =>
    element.name ||
    (/data:/.test(element.url) ? (
      <Text name="core.components.image.local">Local image</Text>
    ) : element.url) || (
      <Text name="core.components.image.empty">No image</Text>
    );

  return (
    <div
      className={classNames(
        'image-component oak-flex oak-items-center oak-gap-4',
        className
      )}
    >
      <div
        className="preview oak-bg-inner-background-color"
        style={{
          backgroundImage: element.url ? `url('${element.url}')` : null,
        }}
      />
      <div className="info">
        <div className="junipero name">{ getName() }</div>
      </div>
    </div>
  );
};

Image.displayName = 'ImageComponent';

export default Image;
