import { useActive, useChainedCommands, useCommands } from '@remirror/react';
// import { Icon } from '@oakjs/react';

import MenuButton from './MenuButton';
import LinkButton from './LinkButton';
import ColorButton from './ColorButton';

const Menu = () => {
  const chain = useChainedCommands();
  const { toggleBold, toggleItalic, toggleUnderline } = useCommands();
  const { bold, italic, underline } = useActive();

  return (
    <div className="menu oak-flex oak-items-stretch oak-gap-1">
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
    </div>
  );
};

Menu.displayName = 'Menu';

export default Menu;
