import { useEffect, useRef, useState } from 'react';
import {
  type ColorFieldRef,
  type FieldContent,
  type DropdownProps,
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Text,
} from '@oakjs/react';
import { useActive, useChainedCommands, useCommands } from '@remirror/react';

import type { Extensions } from '../types';
import MenuButton, { type MenuButtonProps } from './MenuButton';

const ColorButton = (props: MenuButtonProps) => {
  const fieldRef = useRef<ColorFieldRef>();
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
    <Dropdown onToggle={onToggle} className="text-color-field oak-items-center">
      <DropdownToggle>
        <span className="oak-inline-flex oak-items-center">
          <MenuButton
            enabled={() => setTextColor?.enabled(color)}
            isActive={textColor}
            onClick={() => fieldRef.current?.open()}
            className="color-button oak-inline-flex oak-items-center"
            tooltipText={(
              <Text name="addons.remirror.fields.editor.color">
                Color
              </Text>
            )}
            { ...props }
          />
        </span>
      </DropdownToggle>
      <DropdownMenu apparition="css">
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
