export default ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote { ...attributes }>{ children }</blockquote>
      );
    case 'bulleted-list':
      return (
        <ul { ...attributes }>{ children }</ul>
      );
    case 'list-item':
      return (
        <li { ...attributes }>{ children }</li>
      );
    case 'numbered-list':
      return (
        <ol { ...attributes }>{ children }</ol>
      );
    case 'text-left':
      return (
        <div style={{ textAlign: 'left' }} { ...attributes }>{ children }</div>
      );
    case 'text-center':
      return (
        <div
          style={{ textAlign: 'center' }}
          { ...attributes }
        >
          { children }
        </div>
      );
    case 'text-right':
      return (
        <div style={{ textAlign: 'right' }} { ...attributes }>{ children }</div>
      );
    case 'text-justify':
      return (
        <div
          style={{ textAlign: 'justify' }}
          { ...attributes }
        >
          { children }
        </div>
      );
    default:
      return (
        <div { ...attributes }>{ children }</div>
      );
  }
};
