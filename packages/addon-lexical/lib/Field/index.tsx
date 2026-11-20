import {
  type ComponentPropsWithoutRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { type FieldContent, classNames } from '@junipero/react';

import type {
  FieldOptions,
  LexicalFontSize,
  LexicalToolbarItem,
} from '../types';
import { type LexicalFieldContextValue, LexicalFieldContext } from './context';
import { theme } from './theme';
import { $importHtml, htmlConfig } from './html';
import Toolbar, { DEFAULT_FONT_SIZES } from './Toolbar';
import SyncPlugin from './SyncPlugin';
import Cursors, { type FieldCursorItem } from './Cursors';

// Same items as @oakjs/addon-ckeditor5-react's default toolbar
export const DEFAULT_TOOLBAR: LexicalToolbarItem[] = [
  'undo',
  'redo',
  '|',
  'bold',
  'italic',
  'strikethrough',
  'underline',
  'link',
  'fontColor',
  'fontSize',
  'bulletedList',
  'numberedList',
  '|',
  'removeFormat',
  '|',
  'outdent',
  'indent',
  'alignment',
  '|',
  'horizontalLine',
  'blockQuote',
  'insertTable',
];

const NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  HorizontalRuleNode,
];

export interface LexicalFieldProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Html content */
  value?: string;
  /** Toolbar items (see `DEFAULT_TOOLBAR`) */
  toolbar?: LexicalToolbarItem[];
  /** Sizes of the font size menu (see `DEFAULT_FONT_SIZES`) */
  fontSizes?: LexicalFontSize[];
  /** Given by oak builders (translations, dropdowns container...) */
  fieldOptions?: FieldOptions;
  onChange?(field: FieldContent<string>): void;
}

const LexicalField = ({
  className,
  value,
  toolbar = DEFAULT_TOOLBAR,
  fontSizes = DEFAULT_FONT_SIZES,
  fieldOptions,
  onChange,
  ...rest
}: LexicalFieldProps) => {
  const t = fieldOptions?.t;
  const container = fieldOptions?.floatingsRef?.current || undefined;
  const context = useMemo<LexicalFieldContextValue>(() => ({
    t: (key, def) => t?.(key, def) ?? def,
    container,
  }), [t, container]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cursors, setCursors] = useState<FieldCursorItem[]>([]);

  // The value is only used to create the editor, changes are applied by the
  // sync plugin
  const initialValue = useRef(value);
  const initialConfig = useMemo<InitialConfigType>(() => ({
    namespace: 'oak-lexical',
    theme,
    nodes: NODES,
    html: htmlConfig,
    onError: (error: Error) => {
      // eslint-disable-next-line no-console
      console.error('[oak] Lexical field error:', error);
    },
    editorState: editor => $importHtml(editor, initialValue.current),
  }), []);

  const onChange_ = useCallback((html: string) => {
    onChange?.({ value: html });
  }, [onChange]);

  const onCursorsChange = useCallback((next: FieldCursorItem[]) => {
    setCursors(c => !c.length && !next.length ? c : next);
  }, []);

  return (
    <LexicalFieldContext value={context}>
      <div
        { ...rest }
        ref={containerRef}
        className={classNames('oak-lexical-field', className)}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar items={toolbar} fontSizes={fontSizes} />
          <RichTextPlugin
            contentEditable={<ContentEditable className="oak-lexical-editor" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin hasCellMerge={false} hasCellBackgroundColor={false} />
          <HorizontalRulePlugin />
          <SyncPlugin
            value={value}
            onChange={onChange_}
            collaborators={fieldOptions?.collaborators}
            onSelectionChange={fieldOptions?.onSelectionChange}
            containerRef={containerRef}
            onCursorsChange={onCursorsChange}
          />
        </LexicalComposer>
        <Cursors cursors={cursors} />
      </div>
    </LexicalFieldContext>
  );
};

LexicalField.displayName = 'LexicalField';

export default LexicalField;
