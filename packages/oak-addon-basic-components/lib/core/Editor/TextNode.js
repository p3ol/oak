export default ({ text, bold, code, italic, size, underline }) => {
  if (bold) {
    text = (
      <strong>{ text }</strong>
    );
  }

  if (code) {
    text = (
      <code>{ text }</code>
    );
  }

  if (italic) {
    text = (
      <em>{ text }</em>
    );
  }

  if (underline) {
    text = (
      <u>{ text }</u>
    );
  }

  if (size) {
    text = (
      <span style={{ fontSize: size }}>{ text }</span>
    );
  }

  return text;
};
