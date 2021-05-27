import settings from './index.settings';

const Image = ({
  element,
  className,
}) => {
  const getName = () =>
    element.name ||
    (/data:/.test(element.url) ? 'Local image' : element.url) ||
    'Empty image';

  return (
    <div className={className}>
      <div
        className="oak-image-preview"
        style={{
          backgroundImage: element.url ? `url(${element.url})` : null,
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
