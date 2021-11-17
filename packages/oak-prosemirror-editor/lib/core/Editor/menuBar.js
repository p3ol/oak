
import ColorButton from './colorButton';
import { schema } from './schema';
import { getActiveAttrs } from './utils';

export default ({ onToggleMark, onToggleBlock, state }) => {

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
      <button onClick={() => {
        const activeSize = getActiveAttrs(state, schema.marks.size).size ||
         '16px';
        onToggleMark(schema.marks.size, {
          size: (parseInt(activeSize.split('px')[0]) - 1) + 'px',
        });
      }}
      >
        -
      </button>
      <span>{getActiveAttrs(state, schema.marks.size).size || '16px'}</span>
      <button onClick={() => {
        const activeSize = getActiveAttrs(state, schema.marks.size).size ||
         '16px';
        onToggleMark(schema.marks.size, {
          size: (parseInt(activeSize.split('px')[0]) + 1) + 'px',
        });
      }}
      >
        +
      </button>
      <ColorButton
        state={state}
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
