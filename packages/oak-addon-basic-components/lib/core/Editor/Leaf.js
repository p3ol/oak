export default ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = (
      <strong>{ children }</strong>
    );
  }

  if (leaf.code) {
    children = (
      <code>{ children }</code>
    );
  }

  if (leaf.italic) {
    children = (
      <em>{children}</em>
    );
  }

  if (leaf.underline) {
    children = (
      <u>{children}</u>
    );
  }

  if (leaf.size) {
    children = (
      <span style={{ fontSize: leaf.size }}>{ children }</span>
    );
  }

  return (
    <span { ...attributes }>{ children }</span>
  );
};
