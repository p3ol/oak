import { createEditor } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import { theme } from './theme';
import { $importHtml, htmlConfig } from './html';

/** Headless editor with the field's nodes, for tests */
export const createTestEditor = (html = '') => {
  const editor = createEditor({
    namespace: 'test',
    theme,
    nodes: [
      HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode,
      TableNode, TableRowNode, TableCellNode, HorizontalRuleNode,
    ],
    html: htmlConfig,
    onError: e => { throw e; },
  });

  editor.update(() => $importHtml(editor, html), { discrete: true });

  return editor;
};
