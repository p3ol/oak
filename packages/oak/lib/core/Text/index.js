import options from './index.options';

const Text = ({ element, className }) => (
  <div
    className={className}
    style={{
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }}
    dangerouslySetInnerHTML={{ __html: element.content }}
  />
);

Text.options = options;

export default Text;
