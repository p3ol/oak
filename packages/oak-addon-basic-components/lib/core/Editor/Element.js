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
    default:
      return (
        <div { ...attributes }>{ children }</div>
      );
  }
};
