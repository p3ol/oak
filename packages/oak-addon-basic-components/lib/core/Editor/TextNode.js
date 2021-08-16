export default ({ text, bold, code, color, italic, size, underline }) => {
  if (text === '') {
    return (<br />);
  }

  if (text.indexOf('\n') > -1) {
    const props =
     { dangerouslySetInnerHTML: { __html: text.replace('\n', '<br />') } };
    text = <span {...props} />;
  }

  if (bold) {
    text = (
      <strong children={text} />
    );
  }

  if (code) {
    text = (
      <code children={text} />
    );
  }

  if (italic) {
    text = (
      <em children={text} />
    );
  }

  if (underline) {
    text = (
      <u children={text} />
    );
  }

  if (color) {
    text = (
      <span style={{ color }} children={text} />
    );
  }

  if (size) {
    text = (
      <span style={{ fontSize: size }} children={text} />
    );
  }

  return text;
};
