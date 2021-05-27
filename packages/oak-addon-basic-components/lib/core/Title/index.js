import Node from '../Editor/Node';
import settings from './index.settings';

const Title = ({ element, className }) => {
  const Tag = element.headingLevel || 'h1';

  return (
    <div className={className}>
      <Tag>
        { typeof element.content === 'string' ? (
          <Node text={element.content} />
        ) : element.content.map((c, i) => (
          <Node { ...c } key={i} />
        )) }
      </Tag>
    </div>
  );
};

Title.settings = settings;

export default Title;
