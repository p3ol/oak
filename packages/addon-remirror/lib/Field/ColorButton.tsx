import { useEffect, useRef, useState } from 'react';
import {
  type ColorFieldRef,
  type FieldContent,
  type DropdownProps,
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from '@junipero/react';
import { useActive, useChainedCommands, useCommands } from '@remirror/react';

import type { Extensions } from '../types';
import { useRemirrorField } from './context';
import MenuButton, { type MenuButtonProps } from './MenuButton';

const ColorButton = (props: MenuButtonProps) => {
  const { t, container } = useRemirrorField();
  const fieldRef = useRef<ColorFieldRef>(null);
  const { setTextColor } = useCommands();
  const { textColor } = useActive<Extensions>();
  const chain = useChainedCommands();
  const [opened, setOpened] = useState(false);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (opened) {
      fieldRef.current?.open();
    } else {
      fieldRef.current?.close();
    }
  }, [opened]);

  const onToggle: DropdownProps['onToggle'] = ({ opened: o }) => {
    setOpened(o);
  };

  const onChange = (field: FieldContent<string>) => {
    setColor(field.value);
    chain.setTextColor(field.value).run();
  };

  return (
    <Dropdown
      onToggle={onToggle}
      className="text-color-field"
      container={container}
    >
      <DropdownToggle>
        <span className="menu-button-wrapper">
          <MenuButton
            enabled={() => setTextColor?.enabled(color)}
            isActive={textColor}
            onClick={() => fieldRef.current?.open()}
            className="color-button"
            tooltipText={t('addons.remirror.fields.editor.color', 'Color')}
            { ...props }
          />
        </span>
      </DropdownToggle>
      <DropdownMenu apparition="css" className="text-color-menu">
        <ColorField
          ref={fieldRef}
          onChange={onChange}
          value={color}
          trigger="manual"
        />
      </DropdownMenu>
    </Dropdown>
  );
};

ColorButton.displayName = 'ColorButton';

export default ColorButton;
