import { useEffect, useState } from 'react';
import {
  type ElementFormatType,
  type LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $isLinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isTableCellNode, $isTableSelection } from '@lexical/table';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';

export declare interface ToolbarState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  link: { url: string; target: string | null } | null;
  color: string;
  fontSize: string;
  /** `paragraph`, `quote`, `bullet`, `number`, `h1`...`h6` */
  block: string;
  align: ElementFormatType;
  inTable: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const INITIAL_STATE: ToolbarState = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  link: null,
  color: '',
  fontSize: '',
  block: 'paragraph',
  align: '',
  inTable: false,
  canUndo: false,
  canRedo: false,
};

const $readState = (): Partial<ToolbarState> => {
  const selection = $getSelection();

  if ($isTableSelection(selection)) {
    return { inTable: true };
  }

  if (!$isRangeSelection(selection)) {
    return {};
  }

  const anchor = selection.anchor.getNode();
  const link = $findMatchingParent(anchor, $isLinkNode);
  const list = $getNearestNodeOfType(anchor, ListNode);
  const blockNode = $isElementNode(anchor) && !anchor.isInline()
    ? anchor
    : $findMatchingParent(anchor, n => $isElementNode(n) && !n.isInline());
  const quote = $findMatchingParent(anchor, $isQuoteNode);
  const heading = $findMatchingParent(anchor, $isHeadingNode);

  return {
    bold: selection.hasFormat('bold'),
    italic: selection.hasFormat('italic'),
    underline: selection.hasFormat('underline'),
    strikethrough: selection.hasFormat('strikethrough'),
    link: link
      ? { url: link.getURL(), target: link.getTarget() }
      : null,
    color: $getSelectionStyleValueForProperty(selection, 'color', ''),
    fontSize: $getSelectionStyleValueForProperty(selection, 'font-size', ''),
    block: list
      ? list.getListType()
      : quote ? 'quote' : heading ? heading.getTag() : 'paragraph',
    align: $isElementNode(blockNode) ? blockNode.getFormatType() : '',
    inTable: !!$findMatchingParent(anchor, $isTableCellNode),
  };
};

/** State of the toolbar buttons, updated with the editor */
export const useToolbarState = (editor: LexicalEditor) => {
  const [state, setState] = useState<ToolbarState>(INITIAL_STATE);

  useEffect(() => mergeRegister(
    editor.registerUpdateListener(() => {
      const next = editor.read($readState);
      setState(s => ({ ...s, ...next }));
    }),
    editor.registerCommand(CAN_UNDO_COMMAND, canUndo => {
      setState(s => ({ ...s, canUndo }));

      return false;
    }, COMMAND_PRIORITY_CRITICAL),
    editor.registerCommand(CAN_REDO_COMMAND, canRedo => {
      setState(s => ({ ...s, canRedo }));

      return false;
    }, COMMAND_PRIORITY_CRITICAL),
  ), [editor]);

  return state;
};
