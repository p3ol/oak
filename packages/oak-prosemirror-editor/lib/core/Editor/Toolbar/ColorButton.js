import {
  classNames,
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tooltip,
} from '@poool/junipero';
import { Text } from '@poool/oak';
import { useRef, useState } from 'react';

import { schema } from '../schema';
import { getActiveAttrs } from '../utils';

export default ({ className, onChange, state }) => {
  const colorFieldRef = useRef();
  const [color, setColor] = useState('#000000');

  const onChange_ = field => {
    onChange(field.value);
    setColor(field.value);
  };

  const onClick = () => {
    colorFieldRef.current?.dropdownRef.current?.open();
  };

  const getSelectedColor = () => {
    return getActiveAttrs(state, schema.marks.color).color || '#000000';
  };

  return (
    <Dropdown className="oak-color-field">
      <DropdownToggle tag="span">
        <Tooltip text={(
          <Text
            name="addons.richtextField.fields.editor.color"
            default="Color"
          />
        )}
        >
          <a
            href="#"
            onClick={onClick}
            className={classNames(
              'oak-toolbar-button',
              'oak-color-button',
              className,
            )}
          >
            <i className="oak-icons" style={{
              color: getSelectedColor(),
            }}
            >
              format_color_text
            </i>
          </a>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu>
        <ColorField
          ref={colorFieldRef}
          onChange={onChange_}
          value={color}
          popperOptions={{
            strategy: 'relative',
            modifiers: [{
              name: 'offset',
              options: {
                offset: [0, -20],
              },
            }],
          }}
        />
      </DropdownMenu>
    </Dropdown>
  );
};
