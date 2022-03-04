import { Text } from '@poool/oak';

import { schema } from '../schema';
import { getActiveAttrs, getAlignment, isMarkActive } from '../utils';
import ColorButton from './ColorButton';
import MarkButton from './MarkButton';
import LinkButton from './LinkButton';
import SizeButton from './SizeButton';

export default ({
  onToggleMark,
  onToggleBlock,
  onToggleLink,
  state,
  defaultSize,
}) => {
  const getTextSize = () => {
    const selectedSize = parseInt(
      getActiveAttrs(state, schema.marks.size).size?.split('p')[0]
    );

    return selectedSize || defaultSize;
  };

  return (
    <div className="oak-toolbar">
      <MarkButton
        onClick={onToggleMark.bind(null, schema.marks.strong)}
        active={isMarkActive(state, schema.marks.strong)}
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
        active={isMarkActive(state, schema.marks.em)}
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
        active={isMarkActive(state, schema.marks.underline)}
        icon="format_underlined"
        format="underline"
        tooltipText={(
          <Text
            name="addons.richtextField.fields.editor.underline"
            default="Underline"
          />
        )}
      />
      <LinkButton
        state={state}
        onChange={link => onToggleLink(link)}
        active={isMarkActive(state, schema.marks.link)}
      />
      <ColorButton
        state={state}
        onChange={color => onToggleMark(schema.marks.color, { color })}
        active={isMarkActive(state, schema.marks.color)}
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
        onClick={onToggleBlock.bind(
          null,
          schema.nodes.paragraph,
          { alignment: 'left' }
        )}
        active={getAlignment(state) === 'left'}
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
        onClick={onToggleBlock.bind(
          null,
          schema.nodes.paragraph,
          { alignment: 'center' }
        )}
        active={getAlignment(state) === 'center'}
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
        onClick={onToggleBlock.bind(
          null,
          schema.nodes.paragraph,
          { alignment: 'right' }
        )}
        active={getAlignment(state) === 'right'}
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
        onClick={onToggleBlock.bind(
          null,
          schema.nodes.paragraph,
          { alignment: 'justify' }
        )}
        active={getAlignment(state) === 'justify'}
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
