import { Text } from '@poool/oak';

import ColorButton from './ColorButton';
import { schema } from '../schema';
import { getActiveAttrs } from '../utils';
import MarkButton from './MarkButton';
import SizeButton from './SizeButton';
import LinkButton from './LinkButton';

export default ({ onToggleMark, onToggleBlock, state, element = 'text' }) => {

  const SIZES = {
    text: 16,
    headings: { h1: 32, h2: 24, h3: 19, h4: 16, h5: 13, h6: 10 },
  };

  const getDefaultSize = () => {
    return element?.type === 'title'
      ? SIZES.headings[element.headingLevel] || SIZES.text
      : SIZES.text;
  };

  const getTextSize = () => {
    const selectedSize = parseInt(
      getActiveAttrs(state, schema.marks.size).size?.split('p')[0]
    );

    return selectedSize || getDefaultSize();
  };

  return (
    <div className="oak-toolbar">
      <MarkButton
        onClick={onToggleMark.bind(null, schema.marks.strong)}
        icon="format_bold"
        format="bold"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.bold"
            default="Bold"
          />
        )}
      />
      <MarkButton
        onClick={onToggleMark.bind(null, schema.marks.em)}
        icon="format_italic"
        format="italic"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.italic"
            default="Italic"
          />
        )}
      />
      <MarkButton
        onClick={onToggleMark.bind(null, schema.marks.underline)}
        icon="format_underlined"
        format="underline"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.underline"
            default="Underline"
          />
        )}
      />
      <LinkButton />
      <ColorButton
        state={state}
        onChange={color => onToggleMark(schema.marks.color, { color })}
      />
      <SizeButton
        onClick={size => onToggleMark(schema.marks.size, size)}
        icon="horizontal_rule"
        increasing={false}
        currentSize={getTextSize()}
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.decrease"
            default="Decrease size"
          />
        )}
      />
      <span className="oak-text-size">{ getTextSize() }</span>
      <SizeButton
        onClick={size => onToggleMark(schema.marks.size, size)}
        icon="add"
        increasing={true}
        currentSize={getTextSize()}
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.increase"
            default="Increase size"
          />
        )}
      />

      <MarkButton
        onClick={onToggleBlock.bind(null, { alignment: 'left' })}
        icon="format_align_left"
        format="text-left"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.left"
            default="Align left"
          />
        )}
      />
      <MarkButton
        onClick={onToggleBlock.bind(null, { alignment: 'center' })}
        icon="format_align_center"
        format="text-center"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.center"
            default="Align center"
          />
        )}
      />
      <MarkButton
        onClick={onToggleBlock.bind(null, { alignment: 'right' })}
        icon="format_align_right"
        format="text-right"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.right"
            default="Align right"
          />
        )}
      />
      <MarkButton
        onClick={onToggleBlock.bind(null, { alignment: 'justify' })}
        icon="format_align_justify"
        format="text-justify"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.justify"
            default="Justify"
          />
        )}
      />
    </div>
  );
};
