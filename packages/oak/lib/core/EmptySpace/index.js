import settings from './index.settings';
import Text from '../Text';

const EmptySpace = ({ className }) => (
  <div className={className}>
    <Text name="core.components.emptySpace.name" default="Empty space" />
  </div>
);

EmptySpace.settings = settings;

export default EmptySpace;
