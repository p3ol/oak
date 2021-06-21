import Node from '../../../../oak-addon-basic-components/lib/core/Editor/Node';
import settings from './index.settings';

const EmptySpace = ({ element, className }) => {

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
