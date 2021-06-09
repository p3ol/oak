import TextNode from './TextNode';

const Node = ({ type, text, children, ...rest }) => {
  if (text) {
    return (
      <TextNode text={text} { ...rest } />
    );
  }

  children = children?.map((c, i) => (
    <Node { ...c } key={i} />
  )) || null;

  switch (type) {
    case 'block-quote':
      return (
        <blockquote>{ children }</blockquote>
      );
    case 'bulleted-list':
      return (
        <ul>{ children }</ul>
      );
    case 'list-item':
      return (
        <li>{ children }</li>
      );
    case 'numbered-list':
      return (
        <ol>{ children }</ol>
      );
    case 'text-left':
      return (
        <div style={{ textAlign: 'left' }}>{ children }</div>
      );
    case 'text-center':
      return (
        <div style={{ textAlign: 'center' }}>{ children }</div>
      );
    case 'text-right':
      return (
        <div style={{ textAlign: 'right' }}>{ children }</div>
      );
    case 'text-justify':
      return (
        <div style={{ textAlign: 'justify' }}>{ children }</div>
      );
    default:
      return (
        <div>{ children }</div>
      );
  }
};

export default Node;
