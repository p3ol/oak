import { Text } from '@poool/oak';

import settings from './index.settings';

const Image = ({
  element,
  className,
}) => {
  const getName = () =>
    element.name ||
    (/data:/.test(element.url) ? (
      <Text
        name="addons.basicComponents.components.image.local"
        default="Local image"
      />
    ) : element.url) || (
      <Text
        name="addons.basicComponents.components.image.empty"
        default="No image"
      />
    );

  return (
    <div className={className}>
      <div
        className="oak-image-preview"
        style={{
          backgroundImage: element.url ? `url('${element.url}')` : null,
        }}
      />
      <div className="oak-image-info">
        <div className="oak-image-name">{ getName() }</div>
      </div>
    </div>
  );
};

Image.settings = settings;

export default Image;
