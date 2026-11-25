import { useEffect, useRef, useState } from 'react';
import {
  type BaseSelection,
  $getSelection,
  $setSelection,
  HISTORY_MERGE_TAG,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { type ColorFieldRef, ColorField } from '@junipero/react';

import type { ToolbarState } from './useToolbarState';
import { useLexicalField } from './context';
import ToolbarDropdown, { type ToolbarDropdownRef } from './ToolbarDropdown';
import MenuItem from './MenuItem';
import Icon from './Icon';

/**
 * Junipero's color field, displayed inside the menu (its picker is rendered
 * inline, so that using it doesn't close the menu)
 */
const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange(color: string): void;
}) => {
  const fieldRef = useRef<ColorFieldRef>(null);

  useEffect(() => {
    fieldRef.current?.open();
  }, []);

  return (
    <li className="oak-lexical-color-picker">
      <ColorField
        ref={fieldRef}
        trigger="manual"
        value={value}
        onChange={({ value: color, valid }) => {
          if (valid !== false && color) {
            onChange(color);
          }
        }}
      />
    </li>
  );
};

const ColorDropdown = ({ state }: { state: ToolbarState }) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useLexicalField();
  const dropdownRef = useRef<ToolbarDropdownRef>(null);
  // The color field takes the focus: the selection is restored to apply the
  // color
  const selection = useRef<BaseSelection | null>(null);
  // Changes made while picking a color are undone at once
  const changed = useRef(false);
  const [color, setColor] = useState('');

  const apply = (value: string | null) => {
    editor.update(() => {
      if (selection.current) {
        $setSelection(selection.current.clone());
      }

      const current = $getSelection();

      if (current) {
        $patchStyleText(current, { color: value });
      }
    }, changed.current ? { tag: HISTORY_MERGE_TAG } : undefined);

    changed.current = true;
  };

  const onToggle = (opened: boolean) => {
    if (opened) {
      selection.current = editor.read(() => $getSelection()?.clone() ?? null);
      changed.current = false;
      setColor(state.color || '#000000');
    }
  };

  return (
    <ToolbarDropdown
      ref={dropdownRef}
      label={t('addons.lexical.fields.editor.fontColor', 'Font color')}
      icon={<Icon name="fontColor" color={state.color || undefined} />}
      active={!!state.color}
      menuClassName="oak-lexical-color-menu"
      onToggle={onToggle}
    >
      <MenuItem
        className="oak-lexical-color-reset"
        onClick={() => {
          apply(null);
          dropdownRef.current?.close();
          editor.focus();
        }}
      >
        { t('addons.lexical.fields.editor.removeColor', 'Remove color') }
      </MenuItem>
      <ColorPicker value={color} onChange={apply} />
    </ToolbarDropdown>
  );
};

ColorDropdown.displayName = 'ColorDropdown';

export default ColorDropdown;
