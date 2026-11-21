import { Fragment, useRef } from 'react';
import {
  type ElementFormatType,
  type TextFormatType,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  type HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
} from '@lexical/rich-text';
import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableNode,
  INSERT_TABLE_COMMAND,
} from '@lexical/table';

import type { LexicalFontSize, LexicalToolbarItem } from '../types';
import { useLexicalField } from './context';
import { useToolbarState } from './useToolbarState';
import ToolbarButton from './ToolbarButton';
import ToolbarDropdown, { type ToolbarDropdownRef } from './ToolbarDropdown';
import MenuItem from './MenuItem';
import TableSizePicker from './TableSizePicker';
import LinkDropdown from './LinkDropdown';
import ColorDropdown from './ColorDropdown';
import Icon from './Icon';

// Same sizes as CKEditor's default ones, as inline styles
export const DEFAULT_FONT_SIZES: LexicalFontSize[] = [
  { label: 'Tiny', value: '0.7em' },
  { label: 'Small', value: '0.85em' },
  { label: 'Default', value: null },
  { label: 'Big', value: '1.4em' },
  { label: 'Huge', value: '1.8em' },
];

const ALIGNMENTS: { value: ElementFormatType; icon: string; label: string }[] = [
  { value: 'left', icon: 'alignLeft', label: 'Align left' },
  { value: 'center', icon: 'alignCenter', label: 'Align center' },
  { value: 'right', icon: 'alignRight', label: 'Align right' },
  { value: 'justify', icon: 'alignJustify', label: 'Justify' },
];

const HEADINGS: { value: string; label: string }[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
];

const TEXT_FORMATS: Partial<Record<LexicalToolbarItem, {
  format: TextFormatType;
  label: string;
}>> = {
  bold: { format: 'bold', label: 'Bold' },
  italic: { format: 'italic', label: 'Italic' },
  underline: { format: 'underline', label: 'Underline' },
  strikethrough: { format: 'strikethrough', label: 'Strikethrough' },
};

export declare interface ToolbarProps {
  items: LexicalToolbarItem[];
  fontSizes: LexicalFontSize[];
}

const Toolbar = ({ items, fontSizes }: ToolbarProps) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useLexicalField();
  const state = useToolbarState(editor);
  const fontSizeRef = useRef<ToolbarDropdownRef>(null);
  const alignmentRef = useRef<ToolbarDropdownRef>(null);
  const headingRef = useRef<ToolbarDropdownRef>(null);
  const tableRef = useRef<ToolbarDropdownRef>(null);

  const label = (key: string, def: string) =>
    t(`addons.lexical.fields.editor.${key}`, def);

  const setBlock = (create: () => any) => {
    editor.update(() => {
      $setBlocksType($getSelection(), create);
    });
  };

  const removeFormat = () => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      selection.extract().forEach(node => {
        if ($isTextNode(node)) {
          node.setFormat(0);
          node.setStyle('');
        }
      });
      selection.setFormat(0);
      selection.setStyle('');
    });
  };

  const tableAction = (action: () => void) => {
    editor.update(action);
    tableRef.current?.close();
  };

  const renderItem = (item: LexicalToolbarItem, i: number) => {
    const format = TEXT_FORMATS[item];

    if (format) {
      return (
        <ToolbarButton
          key={item}
          label={label(item, format.label)}
          active={state[format.format as keyof typeof state] as boolean}
          onClick={() => editor
            .dispatchCommand(FORMAT_TEXT_COMMAND, format.format)}
        >
          <Icon name={item} />
        </ToolbarButton>
      );
    }

    switch (item) {
      case '|':
        return <span key={`separator-${i}`} className="oak-lexical-separator" />;
      case 'undo':
        return (
          <ToolbarButton
            key={item}
            label={label('undo', 'Undo')}
            disabled={!state.canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          >
            <Icon name="undo" />
          </ToolbarButton>
        );
      case 'redo':
        return (
          <ToolbarButton
            key={item}
            label={label('redo', 'Redo')}
            disabled={!state.canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          >
            <Icon name="redo" />
          </ToolbarButton>
        );
      case 'heading':
        return (
          <ToolbarDropdown
            key={item}
            ref={headingRef}
            label={label('heading', 'Heading')}
            icon={<Icon name="heading" />}
            active={state.block.startsWith('h')}
          >
            { HEADINGS.map(h => (
              <MenuItem
                key={h.value}
                active={state.block === h.value}
                className={`oak-lexical-heading-${h.value}`}
                onClick={() => {
                  setBlock(() => h.value === 'paragraph'
                    ? $createParagraphNode()
                    : $createHeadingNode(h.value as HeadingTagType));
                  headingRef.current?.close();
                }}
              >
                { label(`headings.${h.value}`, h.label) }
              </MenuItem>
            )) }
          </ToolbarDropdown>
        );
      case 'link':
        return <LinkDropdown key={item} state={state} />;
      case 'fontColor':
        return <ColorDropdown key={item} state={state} />;
      case 'fontSize':
        return (
          <ToolbarDropdown
            key={item}
            ref={fontSizeRef}
            label={label('fontSize', 'Font size')}
            icon={<Icon name="fontSize" />}
            active={!!state.fontSize}
          >
            { fontSizes.map(size => (
              <MenuItem
                key={size.label}
                active={(state.fontSize || null) === size.value}
                style={size.value ? { fontSize: size.value } : undefined}
                onClick={() => {
                  editor.update(() => {
                    const selection = $getSelection();

                    if (selection) {
                      $patchStyleText(selection, { 'font-size': size.value });
                    }
                  });
                  fontSizeRef.current?.close();
                }}
              >
                { label(`fontSizes.${size.label.toLowerCase()}`, size.label) }
              </MenuItem>
            )) }
          </ToolbarDropdown>
        );
      case 'bulletedList':
        return (
          <ToolbarButton
            key={item}
            label={label('bulletedList', 'Bulleted list')}
            active={state.block === 'bullet'}
            onClick={() => state.block === 'bullet'
              ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
              : editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          >
            <Icon name="bulletedList" />
          </ToolbarButton>
        );
      case 'numberedList':
        return (
          <ToolbarButton
            key={item}
            label={label('numberedList', 'Numbered list')}
            active={state.block === 'number'}
            onClick={() => state.block === 'number'
              ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
              : editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          >
            <Icon name="numberedList" />
          </ToolbarButton>
        );
      case 'removeFormat':
        return (
          <ToolbarButton
            key={item}
            label={label('removeFormat', 'Remove format')}
            onClick={removeFormat}
          >
            <Icon name="removeFormat" />
          </ToolbarButton>
        );
      case 'outdent':
        return (
          <ToolbarButton
            key={item}
            label={label('outdent', 'Decrease indent')}
            onClick={() => editor
              .dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
          >
            <Icon name="outdent" />
          </ToolbarButton>
        );
      case 'indent':
        return (
          <ToolbarButton
            key={item}
            label={label('indent', 'Increase indent')}
            onClick={() => editor
              .dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
          >
            <Icon name="indent" />
          </ToolbarButton>
        );
      case 'alignment': {
        const current = ALIGNMENTS.find(a => a.value === state.align);

        return (
          <ToolbarDropdown
            key={item}
            ref={alignmentRef}
            label={label('alignment', 'Text alignment')}
            icon={<Icon name={current?.icon || 'alignLeft'} />}
            active={!!current && current.value !== 'left'}
            menuClassName="oak-lexical-alignment-menu"
          >
            { ALIGNMENTS.map(a => (
              <MenuItem
                key={a.value}
                active={state.align === a.value}
                title={label(`align.${a.value}`, a.label)}
                aria-label={label(`align.${a.value}`, a.label)}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, a.value);
                  alignmentRef.current?.close();
                }}
              >
                <Icon name={a.icon} />
              </MenuItem>
            )) }
          </ToolbarDropdown>
        );
      }
      case 'horizontalLine':
        return (
          <ToolbarButton
            key={item}
            label={label('horizontalLine', 'Horizontal line')}
            onClick={() => editor
              .dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
          >
            <Icon name="horizontalLine" />
          </ToolbarButton>
        );
      case 'blockQuote':
        return (
          <ToolbarButton
            key={item}
            label={label('blockQuote', 'Block quote')}
            active={state.block === 'quote'}
            onClick={() => setBlock(() => state.block === 'quote'
              ? $createParagraphNode()
              : $createQuoteNode())}
          >
            <Icon name="blockQuote" />
          </ToolbarButton>
        );
      case 'insertTable':
        return (
          <ToolbarDropdown
            key={item}
            ref={tableRef}
            label={label('table', 'Table')}
            icon={<Icon name="insertTable" />}
            active={state.inTable}
          >
            { !state.inTable ? (
              <TableSizePicker
                onSelect={(rows, columns) => {
                  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                    rows: String(rows),
                    columns: String(columns),
                    includeHeaders: false,
                  });
                  tableRef.current?.close();
                  editor.focus();
                }}
              />
            ) : (
              <>
                <MenuItem
                  onClick={() => tableAction(() =>
                    $insertTableRowAtSelection(false))}
                >
                  { label('tables.rowAbove', 'Insert row above') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction(() =>
                    $insertTableRowAtSelection(true))}
                >
                  { label('tables.rowBelow', 'Insert row below') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction(() =>
                    $insertTableColumnAtSelection(false))}
                >
                  { label('tables.columnLeft', 'Insert column left') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction(() =>
                    $insertTableColumnAtSelection(true))}
                >
                  { label('tables.columnRight', 'Insert column right') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction($deleteTableRowAtSelection)}
                >
                  { label('tables.deleteRow', 'Delete row') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction($deleteTableColumnAtSelection)}
                >
                  { label('tables.deleteColumn', 'Delete column') }
                </MenuItem>
                <MenuItem
                  onClick={() => tableAction(() => {
                    const selection = $getSelection();
                    const node = selection?.getNodes()[0];
                    const table = node && ($isTableNode(node)
                      ? node : $findMatchingParent(node, $isTableNode));
                    table?.remove();
                  })}
                >
                  { label('tables.delete', 'Delete table') }
                </MenuItem>
              </>
            ) }
          </ToolbarDropdown>
        );
      default:
        return null;
    }
  };

  return (
    <div className="oak-lexical-toolbar" role="toolbar">
      { items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>{ renderItem(item, i) }</Fragment>
      )) }
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
