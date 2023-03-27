import { useEffect, useRef, useState } from 'react';
import {
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Text,
  /*Icon, */
} from '@oakjs/react';
import { useActive, useChainedCommands, useCommands } from '@remirror/react';

import MenuButton from './MenuButton';

const ColorButton = ({ children }) => {
  const fieldRef = useRef();
  const { setTextColor } = useCommands();
  const { textColor } = useActive();
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

  const onToggle = ({ opened: o }) => {
    setOpened(o);
  };

  const onChange = field => {
    setColor(field.value);
    chain.setTextColor(field.value).run();
  };

  return (
    <Dropdown onToggle={onToggle} className="text-color-field oak-items-center">
      <DropdownToggle>
        <span className="oak-inline-flex oak-items-center">
          <MenuButton
            enabled={setTextColor?.enabled}
            isActive={textColor}
            onClick={() => fieldRef.current?.open()}
            className="color-button oak-inline-flex oak-items-center"
            tooltipText={(
              <Text name="addons.remirror.fields.editor.color">
                Color
              </Text>
            )}
          >
            { children }
          </MenuButton>
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
