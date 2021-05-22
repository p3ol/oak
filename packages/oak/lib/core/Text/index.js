
import EditBox from '../EditBox';
import TextOptions from './TextOptions';

const Text = ({ element }) => (
  <p
    style={{
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }}
    dangerouslySetInnerHTML={{ __html: element.content }}
  />
);

Text.options = [{
  render: ({ element }) => {
    return (
      <EditBox title="Text options">
        <TextOptions element={element} />
      </EditBox>
    );
  },
}];

export default Text;
