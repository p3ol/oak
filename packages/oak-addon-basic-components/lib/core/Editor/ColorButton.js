import { useEffect, useRef, useState } from 'react';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import {
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tooltip,
} from '@poool/junipero';
import { classNames } from '@poool/junipero-utils';

import { toggleMark } from './editor';

export default ({ className }) => {
  const editor = useSlate();
  const colorFieldRef = useRef();
  const [selection, setSelection] = useState(editor.selection);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (!editor || !editor.selection) {
      return;
    }

    setSelection(editor.selection);
  }, [editor.selection]);

  const onChange = field => {
    if (!selection) {
      return;
    }

    Transforms.select(editor, selection);
    setColor(field.value);
    toggleMark(editor, 'color', field.value);
  };

  const onClick = () => {
    colorFieldRef.current?.dropdownRef.current?.open();
    const selectedColor = getSelectedColor();
    setColor(selectedColor);
  };

  const getSelectedColor = () => {
    const path = selection?.anchor?.path;
    const selectedRow = editor.children[path?.[0]];
    const selectedContent = Array.isArray(selectedRow)
      ? selectedRow[path?.[1]]
      : selectedRow?.children?.[path?.[1]];
    const selectedColor = selectedContent?.color || '#000000';

    return selectedColor;
  };

  return (
    <Dropdown>
      <DropdownToggle tag="span">
        <Tooltip text="Color">
          <a
            href="#"
            onClick={onClick}
            className={classNames(
              'oak-toolbar-button',
              'oak-color-button',
              className,
            )}
          >
            <i className="oak-icons" style={{ color: getSelectedColor() }}>
              format_color_text
            </i>
          </a>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu>
        <ColorField
          ref={colorFieldRef}
          className="oak-color-field py-3"
          value={color}
          onChange={onChange}
        />
      </DropdownMenu>
    </Dropdown>
  );
};
