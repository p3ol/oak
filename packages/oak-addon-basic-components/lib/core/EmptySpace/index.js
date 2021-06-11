import Node from '../Editor/Node';
import settings from './index.settings';

const EmptySpace = ({ element, className }) => {
  console.log({ element });
  return (
    <div className={className}>
      <Node
        style={{ height: element.settings.height }}
        text="Empty space"
      />
    </div>
  );
};

EmptySpace.settings = settings;

export default EmptySpace;
