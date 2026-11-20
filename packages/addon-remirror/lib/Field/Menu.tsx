import {
  useActive,
  useChainedCommands,
  useCommands,
  useHelpers,
} from '@remirror/react';

import type { Extensions } from '../types';
import MenuButton from './MenuButton';
import LinkButton from './LinkButton';
import ColorButton from './ColorButton';
import { useRemirrorField } from './context';
import Icon from './Icon';

const Menu = () => {
  const { t } = useRemirrorField();
  const chain = useChainedCommands();
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    increaseFontSize,
    decreaseFontSize,
    leftAlign,
    centerAlign,
    rightAlign,
    justifyAlign,
  } = useCommands<Extensions>();
  const { getFontSizeForSelection } = useHelpers();
  const { bold, italic, underline, paragraph } = useActive();

  const fontSize = () => {
    const [size] = getFontSizeForSelection() || [];

    if (Array.isArray(size)) {
      return size[0];
    } else if (typeof size === 'string') {
      return ('' + size).replace('px', '');
    }

    return 16;
  };

  return (
    <div className="menu">
      <MenuButton
        enabled={toggleBold?.enabled}
        isActive={bold}
        tooltipText={t('addons.remirror.fields.editor.bold', 'Bold')}
        onClick={() => chain.toggleBold().focus().run()}
        className="bold"
      >
        <Icon>bold</Icon>
      </MenuButton>
      <MenuButton
        enabled={toggleItalic?.enabled}
        isActive={italic}
        tooltipText={t('addons.remirror.fields.editor.italic', 'Italic')}
        onClick={() => chain.toggleItalic().focus().run()}
        className="italic"
      >
        <Icon>italic</Icon>
      </MenuButton>
      <MenuButton
        enabled={toggleUnderline?.enabled}
        isActive={underline}
        tooltipText={t('addons.remirror.fields.editor.underline', 'Underline')}
        onClick={() => chain.toggleUnderline().focus().run()}
        className="underline"
      >
        <Icon>underline</Icon>
      </MenuButton>
      <LinkButton>
        <Icon>url</Icon>
      </LinkButton>
      <ColorButton>
        <Icon>text_color</Icon>
      </ColorButton>
      <div className="font-size">
        <MenuButton
          enabled={decreaseFontSize?.enabled}
          isActive={() => false}
          tooltipText={t(
            'addons.remirror.fields.editor.decreaseSize', 'Decrease size'
          )}
          onClick={() => chain.decreaseFontSize().focus().run()}
        >
          <Icon>minus</Icon>
        </MenuButton>
        <div className="junipero secondary font-size-value">
          { fontSize() }
        </div>
        <MenuButton
          enabled={increaseFontSize?.enabled}
          isActive={() => false}
          tooltipText={t(
            'addons.remirror.fields.editor.increaseSize', 'Increase size'
          )}
          onClick={() => chain.increaseFontSize().focus().run()}
        >
          <Icon>add</Icon>
        </MenuButton>
      </div>
      <MenuButton
        enabled={leftAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'left' })}
        tooltipText={t('addons.remirror.fields.editor.alignLeft', 'Left align')}
        onClick={() => chain.leftAlign().focus().run()}
      >
        <Icon>align_left</Icon>
      </MenuButton>
      <MenuButton
        enabled={centerAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'center' })}
        tooltipText={t(
          'addons.remirror.fields.editor.alignCenter', 'Center align'
        )}
        onClick={() => chain.centerAlign().focus().run()}
      >
        <Icon>align_center</Icon>
      </MenuButton>
      <MenuButton
        enabled={rightAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'right' })}
        tooltipText={t(
          'addons.remirror.fields.editor.alignRight', 'Right align'
        )}
        onClick={() => chain.rightAlign().focus().run()}
      >
        <Icon>align_right</Icon>
      </MenuButton>
      <MenuButton
        enabled={justifyAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'justify' })}
        tooltipText={t('addons.remirror.fields.editor.justify', 'Justify')}
        onClick={() => chain.justifyAlign().focus().run()}
      >
        <Icon>align_justify</Icon>
      </MenuButton>
    </div>
  );
};

Menu.displayName = 'Menu';

export default Menu;
