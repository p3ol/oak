import settings from './index.settings';
import Node from '../Editor/Node';

const Text = ({ element, className }) => (
  <div className={className}>
    { typeof element.content === 'string' ? (
      <Node type="paragraph" children={[{ text: element.content }]} />
    ) : element.content.map((c, i) => (
      <Node { ...c } key={i} />
    )) }
  </div>
);

Text.settings = settings;

export default Text;
