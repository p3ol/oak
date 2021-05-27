import Node from '../Editor/Node';
import settings from './index.settings';

const Button = ({ element, className }) => {
  return (
    <div className={className}>
      { typeof element.content === 'string' ? (
        <Node text={element.content} />
      ) : element.content.map((c, i) => (
        <Node { ...c } key={i} />
      )) }
    </div>
  );
};

Button.settings = settings;

export default Button;
