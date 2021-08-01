export default ({ text, bold, code, color, italic, size, underline }) => {
  if (text === '') {
    return (<br />);
  }

  const props = text.indexOf('\n') > -1 ? {
    dangerouslySetInnerHTML: { __html: text.replace('\n', '<br />') },
  } : { children: text };

  if (bold) {
    text = (
      <strong { ...props } />
    );
  }

  if (code) {
    text = (
      <code { ...props } />
    );
  }

  if (italic) {
    text = (
      <em { ...props } />
    );
  }

  if (underline) {
    text = (
      <u { ...props } />
    );
  }

  if (color) {
    text = (
      <span style={{ color }} { ...props } />
    );
  }

  if (size) {
    text = (
      <span style={{ fontSize: size }} { ...props } />
    );
  }

  return text;
};
