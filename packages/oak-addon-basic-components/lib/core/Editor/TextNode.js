export default ({ text, bold, code, italic, underline }) => {
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

  return text;
};
