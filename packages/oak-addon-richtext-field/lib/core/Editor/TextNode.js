export default ({
  text,
  bold,
  code,
  color,
  italic,
  size,
  underline,
}) => {
  if (text === '') {
    return (<br />);
  }

  if (text.indexOf('\n') > -1) {
    text = (
      <span
        dangerouslySetInnerHTML={{ __html: text.replace('\n', '<br />') }}
      />
    );
  }

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

  if (color) {
    text = (
      <span style={{ color }}>{ text }</span>
    );
  }

  if (size) {
    text = (
      <span style={{ fontSize: size }}>{ text }</span>
    );
  }

  return text;
};
