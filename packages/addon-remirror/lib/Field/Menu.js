import {
  useActive,
  useChainedCommands,
  useCommands,
  useHelpers,
} from '@remirror/react';
// import { Icon } from '@oakjs/react';

import MenuButton from './MenuButton';
import LinkButton from './LinkButton';
import ColorButton from './ColorButton';

const Menu = () => {
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
  } = useCommands();
  const { getFontSizeForSelection } = useHelpers();
  const { bold, italic, underline, paragraph } = useActive();

  const fontSize = () => {
    const [size] = getFontSizeForSelection() || [];

    if (Array.isArray(size)) {
      return size[0];
    } else if (typeof size === 'string') {
      return size.replace('px', '');
    }

    return 16;
  };

  return (
    <div className="menu oak-flex oak-items-stretch oak-gap-2">
      <MenuButton
        enabled={toggleBold?.enabled}
        isActive={bold}
        tooltipText="Bold"
        onClick={() => chain.toggleBold().focus().run()}
        className="bold"
      >
        { /* <Icon>bold</Icon> */ }
        <i className="oak-icons">format_bold</i>
      </MenuButton>
      <MenuButton
        enabled={toggleItalic?.enabled}
        isActive={italic}
        tooltipText="Italic"
        onClick={() => chain.toggleItalic().focus().run()}
        className="italic"
      >
        { /* <Icon>italic</Icon> */ }
        <i className="oak-icons">format_italic</i>
      </MenuButton>
      <MenuButton
        enabled={toggleUnderline?.enabled}
        isActive={underline}
        tooltipText="Underline"
        onClick={() => chain.toggleUnderline().focus().run()}
        className="underline"
      >
        { /* <Icon>underline</Icon> */ }
        <i className="oak-icons">format_underlined</i>
      </MenuButton>
      <LinkButton>
        { /* <Icon>link</Icon> */ }
        <i className="oak-icons">link</i>
      </LinkButton>
      <ColorButton>
        { /* <Icon>color</Icon> */ }
        <i className="oak-icons">format_color_text</i>
      </ColorButton>
      <div className="oak-flex oak-items-center oak-gap-2 oak-px-1">
        <MenuButton
          enabled={decreaseFontSize?.enabled}
          isActive={() => false}
          tooltipText="Decrease size"
          onClick={() => chain.decreaseFontSize().focus().run()}
        >
          { /* <Icon>minus</Icon> */ }
          <i className="oak-icons">horizontal_rule</i>
        </MenuButton>
        <div className="junipero secondary !oak-text-slate">{ fontSize() }</div>
        <MenuButton
          enabled={increaseFontSize?.enabled}
          isActive={() => false}
          tooltipText="Increase size"
          onClick={() => chain.increaseFontSize().focus().run()}
        >
          { /* <Icon>add</Icon> */ }
          <i className="oak-icons">add</i>
        </MenuButton>
      </div>
      <MenuButton
        enabled={leftAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'left' })}
        tooltipText="Left align"
        onClick={() => chain.leftAlign().focus().run()}
      >
        { /* <Icon>align_left</Icon> */ }
        <i className="oak-icons">format_align_left</i>
      </MenuButton>
      <MenuButton
        enabled={centerAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'center' })}
        tooltipText="Center align"
        onClick={() => chain.centerAlign().focus().run()}
      >
        { /* <Icon>align_center</Icon> */ }
        <i className="oak-icons">format_align_center</i>
      </MenuButton>
      <MenuButton
        enabled={rightAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'right' })}
        tooltipText="Right align"
        onClick={() => chain.rightAlign().focus().run()}
      >
        { /* <Icon>align_right</Icon> */ }
        <i className="oak-icons">format_align_right</i>
      </MenuButton>
      <MenuButton
        enabled={justifyAlign?.enabled}
        isActive={() => paragraph({ nodeTextAlignment: 'justify' })}
        tooltipText="Justify"
        onClick={() => chain.justifyAlign().focus().run()}
      >
        { /* <Icon>align_justify</Icon> */ }
        <i className="oak-icons">format_align_justify</i>
      </MenuButton>
    </div>
  );
};

Menu.displayName = 'Menu';

export default Menu;
