
import ColorButton from './colorButton';
import { schema } from './schema';

export default ({ onToggle }) => {

  return (
    <>
      <button onClick={onToggle.bind(null, schema.marks.strong)}>
        Bold
      </button>
      <button onClick={onToggle.bind(null, schema.marks.em)}>
        italic
      </button>
      <button onClick={onToggle.bind(null, schema.marks.underline)}>
        underline
      </button>
      <ColorButton
        onChange={color => onToggle(schema.marks.color, { color })}
      />
    </>
  );
};
