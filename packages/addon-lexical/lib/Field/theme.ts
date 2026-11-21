import type { EditorThemeClasses } from 'lexical';

/**
 * Classes used to display the content inside the editor. They're removed from
 * the html given to `onChange`, which only relies on tags & inline styles.
 */
export const theme: EditorThemeClasses = {
  paragraph: 'oak-lexical-paragraph',
  quote: 'oak-lexical-quote',
  heading: {
    h1: 'oak-lexical-h1',
    h2: 'oak-lexical-h2',
    h3: 'oak-lexical-h3',
    h4: 'oak-lexical-h4',
    h5: 'oak-lexical-h5',
    h6: 'oak-lexical-h6',
  },
  list: {
    ul: 'oak-lexical-ul',
    ol: 'oak-lexical-ol',
    listitem: 'oak-lexical-li',
    nested: { listitem: 'oak-lexical-nested-li' },
  },
  link: 'oak-lexical-link',
  hr: 'oak-lexical-hr',
  indent: 'oak-lexical-indent',
  table: 'oak-lexical-table',
  tableRow: 'oak-lexical-tr',
  tableCell: 'oak-lexical-td',
  tableCellHeader: 'oak-lexical-th',
  tableSelection: 'oak-lexical-table-selection',
  tableCellSelected: 'oak-lexical-td-selected',
  text: {
    bold: 'oak-lexical-bold',
    italic: 'oak-lexical-italic',
    underline: 'oak-lexical-underline',
    strikethrough: 'oak-lexical-strikethrough',
    underlineStrikethrough: 'oak-lexical-underline-strikethrough',
  },
};
