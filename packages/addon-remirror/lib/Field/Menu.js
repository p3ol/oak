import { useActive, useChainedCommands, useCommands } from '@remirror/react';
// import { Icon } from '@oakjs/react';

import MenuButton from './MenuButton';

const Menu = () => {
  const chain = useChainedCommands();
  const { toggleBold, toggleItalic, toggleUnderline } = useCommands();
  const { bold, italic, underline } = useActive();

  return (
    <div className="menu oak-flex oak-items-center oak-gap-2">
      <MenuButton
        enabled={toggleBold?.enabled}
        isActive={bold}
        tooltipText="Bold"
        onClick={() => chain.toggleBold().focus().run()}
      >
        { /* <Icon>bold</Icon> */ }
        <i className="oak-icons">format_bold</i>
      </MenuButton>
      <MenuButton
        enabled={toggleItalic?.enabled}
        active={italic}
        tooltipText="Italic"
        onClick={() => chain.toggleItalic().focus().run()}
      >
        { /* <Icon>italic</Icon> */ }
        <i className="oak-icons">format_italic</i>
      </MenuButton>
      <MenuButton
        enabled={toggleUnderline?.enabled}
        active={underline}
        tooltipText="Underline"
        onClick={() => chain.toggleUnderline().focus().run()}
      >
        { /* <Icon>underline</Icon> */ }
        <i className="oak-icons">format_underlined</i>
      </MenuButton>
    </div>
  );
};

Menu.displayName = 'Menu';

export default Menu;
