import type { Editor, EditorConfig, EventInfo } from 'ckeditor5';
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  type FieldContent,
  type ElementObject,
  classNames,
} from '@oakjs/react';

import type { ClassicEditor } from '../Editor';
import type { CollaborationFieldOptions } from './types';
import { getOffset, restoreSelection, saveSelection } from './selection';
import { measureSelection } from './measure';
import Cursors, { type FieldCursorItem } from './Cursors';

export interface CKEditorFieldProps extends ComponentPropsWithoutRef<any> {
  editor?: ClassicEditor;
  config?: EditorConfig;
  value?: string;
  /**
   * Given by oak builders (`CollaborationFieldOptions` with @oakjs/ash)
   */
  fieldOptions?: any;
  onChange?(field: FieldContent<string>, element?: ElementObject): void;
}

const CKEditorField = ({
  className,
  editor,
  config,
  value,
  fieldOptions: fieldOptionsProp,
  onChange,
}: CKEditorFieldProps) => {
  const fieldOptions = fieldOptionsProp as CollaborationFieldOptions | undefined;
  const [defaultEditor, setDefaultEditor] = useState<{
    classicEditor: typeof ClassicEditor;
  }>();

  const loadEditor = useCallback(async () => {
    const Editor = (await import('../Editor')).default;

    setDefaultEditor({
      classicEditor: Editor,
    });
  }, []);

  useEffect(() => {
    if (!editor && !defaultEditor) {
      loadEditor();
    }
  }, [editor, defaultEditor, loadEditor]);

  // The value is only given to CKEditor when it is created: CKEditor's react
  // integration replaces the whole document when its `data` prop changes,
  // which loses the selection. Changes are applied below instead.
  const [initialData] = useState(value);
  const instance = useRef<Editor | null>(null);
  const lastValue = useRef(value);
  const applying = useRef(false);

  // Changes made outside of the editor (e.g. by another user) are applied
  // while keeping the selection (moved along with the content changed before
  // it)
  const applyValue = useCallback((ed: Editor, next?: string) => {
    if (next === undefined || next === lastValue.current) {
      return;
    }

    lastValue.current = next;

    if (ed.getData() === next) {
      return;
    }

    const selection = ed.editing.view.document.isFocused
      ? saveSelection(ed)
      : null;

    applying.current = true;

    try {
      ed.data.set(next);

      if (selection) {
        restoreSelection(ed, selection);
      }
    } finally {
      applying.current = false;
    }
  }, []);

  useEffect(() => {
    if (instance.current) {
      applyValue(instance.current, value);
    }
  }, [value, applyValue]);

  // Local selection, shared with the other users (on the next frame: the
  // builder shouldn't be updated while the editor handles an event)
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectionChangeRef = useRef(fieldOptions?.onSelectionChange);
  onSelectionChangeRef.current = fieldOptions?.onSelectionChange;
  const lastSelection = useRef<string | null>(null);
  const selectionFrame = useRef<number>(null);

  const reportSelection = useCallback(() => {
    cancelAnimationFrame(selectionFrame.current);
    selectionFrame.current = requestAnimationFrame(() => {
      const ed = instance.current;
      const range = ed?.model.document.selection;
      const selection = ed?.ui.focusTracker.isFocused && range?.anchor
        ? {
          anchor: getOffset(ed, range.anchor),
          head: getOffset(ed, range.focus!),
        }
        : null;
      const serialized = JSON.stringify(selection);

      if (serialized !== lastSelection.current) {
        lastSelection.current = serialized;
        onSelectionChangeRef.current?.(selection);
      }
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(selectionFrame.current), []);

  // Other users' cursors
  const collaborators = fieldOptions?.collaborators;
  const [cursors, setCursors] = useState<FieldCursorItem[]>([]);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const relayout = useCallback(() => setLayoutVersion(v => v + 1), []);

  useLayoutEffect(() => {
    const ed = instance.current;
    const container = containerRef.current;

    if (!ed || !container || !collaborators?.length) {
      setCursors(c => c.length ? [] : c);

      return;
    }

    setCursors(collaborators.map(c => ({
      ...c,
      ...measureSelection(ed, container, c),
    })));
  }, [collaborators, layoutVersion]);

  const onReady = useCallback((ed: Editor) => {
    instance.current = ed;
    // The value may have changed while the editor was loading
    lastValue.current = initialData;
    applyValue(ed, value);

    ed.model.document.selection.on('change:range', reportSelection);
    ed.ui.focusTracker.on('change:isFocused', reportSelection);
    ed.model.document.on('change:data', relayout);

    const editable = ed.editing.view.getDomRoot();

    if (editable) {
      const observer = new ResizeObserver(relayout);
      observer.observe(editable);
      editable.addEventListener('scroll', relayout);
      ed.on('destroy', () => {
        observer.disconnect();
        editable.removeEventListener('scroll', relayout);
      });
    }

    relayout();
  }, [initialData, value, applyValue, reportSelection, relayout]);

  const onChange_ = useCallback((_: EventInfo, ed: ClassicEditor) => {
    if (applying.current) {
      return;
    }

    const data = ed.getData();
    lastValue.current = data;
    onChange?.({ value: data });
  }, [onChange]);

  if (!editor && !defaultEditor) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={classNames('ckeditor-field', className)}
      style={{ position: 'relative' }}
    >
      <CKEditor
        // @ts-expect-error CK editor is weird anyway
        editor={editor || defaultEditor?.classicEditor}
        config={config}
        data={initialData}
        onReady={onReady}
        onChange={onChange_}
        onAfterDestroy={() => { instance.current = null; }}
      />
      <Cursors cursors={cursors} />
    </div>
  );
};

CKEditorField.displayName = 'CKEditorField';

export default CKEditorField;
