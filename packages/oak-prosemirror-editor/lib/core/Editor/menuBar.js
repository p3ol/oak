
import ColorButton from './colorButton';
import { schema } from './schema';

export default ({ onToggleMark, onToggleBlock }) => {

  return (
    <>
      <button onClick={onToggleMark.bind(null, schema.marks.strong)}>
        Bold
      </button>
      <button onClick={onToggleMark.bind(null, schema.marks.em)}>
        italic
      </button>
      <button onClick={onToggleMark.bind(null, schema.marks.underline)}>
        underline
      </button>
      <button onClick={onToggleMark.bind(null, schema.marks.size, { size: '18px' })}>
        +
      </button>
      <ColorButton
        onChange={color => onToggleMark(schema.marks.color, { color })}
      />
      <button onClick={onToggleBlock.bind(null, { alignment: 'left' })}>
        left
      </button>
      <button onClick={onToggleBlock.bind(null, { alignment: 'center' })}>
        center
      </button>
      <button onClick={onToggleBlock.bind(null, { alignment: 'right' })}>
        right
      </button>
      <button onClick={onToggleBlock.bind(null, { alignment: 'justify' })}>
        justified
      </button>
    </>
  );
};
