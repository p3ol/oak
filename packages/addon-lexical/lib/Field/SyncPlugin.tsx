import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  type LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  BLUR_COMMAND,
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
  HISTORIC_TAG,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

import type { FieldCollaborator, FieldSelection } from './types';
import type { FieldCursorItem } from './Cursors';
import { $exportHtml, $importHtml } from './html';
import {
  $getPointOffset,
  $selectOffsets,
  $serialize,
  mapPosition,
} from './positions';
import { measureSelection } from './measure';

// Marks updates applying changes made outside of the editor
const EXTERNAL_TAG = 'oak-external-change';

const isFocused = (editor: LexicalEditor) => {
  const root = editor.getRootElement();

  return !!root && root.ownerDocument.activeElement === root;
};

export declare interface SyncPluginProps {
  value?: string;
  onChange?(value: string): void;
  collaborators?: FieldCollaborator[];
  onSelectionChange?(selection: FieldSelection | null): void;
  containerRef: RefObject<HTMLElement>;
  onCursorsChange(cursors: FieldCursorItem[]): void;
}

/**
 * Keeps the editor in sync with the field's value (changes made outside of
 * the editor, e.g. by another user, keep the selection), and shares the
 * local selection & displays the other users' ones
 */
const SyncPlugin = ({
  value,
  onChange,
  collaborators,
  onSelectionChange,
  containerRef,
  onCursorsChange,
}: SyncPluginProps): null => {
  const [editor] = useLexicalComposerContext();
  // Last value given to (or emitted by) the field, and the editor's html
  // for this value (which can be formatted differently)
  const lastValue = useRef(value);
  const baseline = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const [layoutVersion, setLayoutVersion] = useState(0);

  // Local selection, reported on the next frame: the builder shouldn't be
  // updated while the editor handles an event
  const lastSelection = useRef<string | null>(null);
  const frame = useRef<number>(null);

  const reportSelection = useRef((): void => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const selection = isFocused(editor)
        ? editor.read(() => {
          const s = $getSelection();

          return $isRangeSelection(s)
            ? { anchor: $getPointOffset(s.anchor), head: $getPointOffset(s.focus) }
            : null;
        })
        : null;
      const serialized = JSON.stringify(selection);

      if (serialized !== lastSelection.current) {
        lastSelection.current = serialized;
        onSelectionChangeRef.current?.(selection);
      }
    });
  }).current;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Local changes. Normalizing the initial value (e.g. on mount) is not a
  // change: only changes made to the content are emitted.
  useEffect(() => {
    baseline.current = editor.read(() => $exportHtml(editor));

    return mergeRegister(
      editor.registerUpdateListener(({ dirtyElements, dirtyLeaves, tags }) => {
        reportSelection();
        setLayoutVersion(v => v + 1);

        if (!dirtyElements.size && !dirtyLeaves.size) {
          return;
        }

        const html = editor.read(() => $exportHtml(editor));

        if (tags.has(EXTERNAL_TAG) || html === baseline.current) {
          baseline.current = html;

          return;
        }

        baseline.current = html;
        lastValue.current = html;
        onChangeRef.current?.(html);
      }),
      editor.registerCommand(FOCUS_COMMAND, () => {
        reportSelection();

        return false;
      }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(BLUR_COMMAND, () => {
        reportSelection();

        return false;
      }, COMMAND_PRIORITY_LOW),
    );
  }, [editor, reportSelection]);

  // Changes made outside of the editor
  useEffect(() => {
    if (value === undefined || value === lastValue.current) {
      return;
    }

    lastValue.current = value;
    const current = editor.read(() => $exportHtml(editor));

    // Same content (e.g. a value emitted by this field)
    if (current === value) {
      baseline.current = current;

      return;
    }

    const focused = isFocused(editor);

    editor.update(() => {
      const selection = $getSelection();
      const saved = focused && $isRangeSelection(selection)
        ? {
          text: $serialize(),
          anchor: $getPointOffset(selection.anchor),
          focus: $getPointOffset(selection.focus),
        }
        : null;

      $importHtml(editor, value);

      if (!saved) {
        $setSelection(null);

        return;
      }

      const text = $serialize();

      try {
        $selectOffsets(
          mapPosition(saved.anchor, saved.text, text),
          mapPosition(saved.focus, saved.text, text),
        );
      } catch {
        $setSelection(null);
      }
    }, { tag: [EXTERNAL_TAG, HISTORIC_TAG], discrete: true });
    baseline.current = editor.read(() => $exportHtml(editor));

    // The undo history is made of snapshots of the whole document: undoing
    // would revert the other users' changes
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  }, [value, editor]);

  // Other users' cursors
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !collaborators?.length) {
      onCursorsChange([]);

      return;
    }

    onCursorsChange(collaborators.map(c => ({
      ...c,
      ...measureSelection(editor, container, c),
    })));
  }, [collaborators, layoutVersion, editor, containerRef, onCursorsChange]);

  const hasCollaborators = !!collaborators?.length;

  useEffect(() => {
    const root = editor.getRootElement();

    if (!root || !hasCollaborators) {
      return;
    }

    const observer = new ResizeObserver(() => setLayoutVersion(v => v + 1));
    observer.observe(root);

    return () => observer.disconnect();
  }, [editor, hasCollaborators]);

  return null;
};

SyncPlugin.displayName = 'SyncPlugin';

export default SyncPlugin;
