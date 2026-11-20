import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  type TextFieldProps,
  type TextFieldRef,
  TextField,
} from '@junipero/react';

import type { FieldCollaborator, FieldSelection } from '../../types';
import { mapTextPosition } from '../../textChanges';
import FieldCursors, { type FieldCursorItem } from '../FieldCursors';
import { measureTextSelection } from './measure';

const MAX_FRAMES = 5;

export declare interface SyncedTextFieldProps extends TextFieldProps {
  /** Other users whose cursor is in this field */
  collaborators?: FieldCollaborator[];
  /** Called when the local selection changes (`null` on blur) */
  onSelectionChange?(selection: FieldSelection | null): void;
}

const getSelection = (
  input: HTMLInputElement | HTMLTextAreaElement
): FieldSelection => {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? start;

  return input.selectionDirection === 'backward'
    ? { anchor: end, head: start }
    : { anchor: start, head: end };
};

/**
 * A text field whose value can be changed from the outside (e.g. by another
 * user) while the user is typing in it, without moving the caret: the caret
 * is moved along with the text changed before it. Other users' cursors can
 * be displayed in it, and the local one shared.
 */
const SyncedTextField = ({
  collaborators,
  onSelectionChange,
  ...props
}: SyncedTextFieldProps) => {
  const fieldRef = useRef<TextFieldRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const value = props.value === undefined || props.value === null
    ? '' : String(props.value);

  // Local selection
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const lastSelection = useRef<string | null>(null);

  const reportSelection = useRef((
    input: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    const focused = input && input.ownerDocument.activeElement === input;
    const selection = focused ? getSelection(input) : null;
    const serialized = JSON.stringify(selection);

    if (serialized !== lastSelection.current) {
      lastSelection.current = serialized;
      onSelectionChangeRef.current?.(selection);
    }
  }).current;

  useEffect(() => {
    const input = fieldRef.current?.inputRef?.current;

    if (!input) {
      return;
    }

    const doc = input.ownerDocument;
    let frame: number;

    // Reported on the next frame: updating the builder while the input
    // handles an event would make React restore its previous value
    const report = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => reportSelection(input));
    };

    const events = ['focus', 'blur', 'select', 'input', 'keyup', 'mouseup'];

    events.forEach(e => input.addEventListener(e, report));
    doc.addEventListener('selectionchange', report);

    return () => {
      cancelAnimationFrame(frame);
      events.forEach(e => input.removeEventListener(e, report));
      doc.removeEventListener('selectionchange', report);
    };
  }, [reportSelection]);

  // Changes made from the outside
  useEffect(() => {
    const input = fieldRef.current?.inputRef?.current;

    // Changes made by the user are already displayed by the input
    if (
      !input ||
      input.ownerDocument.activeElement !== input ||
      input.value === value
    ) {
      return;
    }

    const previous = input.value;
    const start = mapTextPosition(input.selectionStart ?? 0, previous, value);
    const end = mapTextPosition(input.selectionEnd ?? 0, previous, value);
    let frame: number;

    // The input displays the new value once the field re-rendered
    const restore = (tries = 0) => {
      if (input.value === value) {
        input.setSelectionRange(start, end, input.selectionDirection);
        reportSelection(input);
      } else if (tries < MAX_FRAMES) {
        frame = requestAnimationFrame(() => restore(tries + 1));
      }
    };

    restore();

    return () => cancelAnimationFrame(frame);
  }, [value, reportSelection]);

  // Other users' cursors
  const [cursors, setCursors] = useState<FieldCursorItem[]>([]);
  const [layoutVersion, setLayoutVersion] = useState(0);

  useLayoutEffect(() => {
    const input = fieldRef.current?.inputRef?.current;
    const container = containerRef.current;

    if (!input || !container || !collaborators?.length) {
      setCursors(c => c.length ? [] : c);

      return;
    }

    setCursors(collaborators.map(c => ({
      ...c,
      ...measureTextSelection(input, container, c),
    })));
  }, [collaborators, value, layoutVersion]);

  const hasCollaborators = !!collaborators?.length;

  useEffect(() => {
    const input = fieldRef.current?.inputRef?.current;

    if (!input || !hasCollaborators) {
      return;
    }

    const relayout = () => setLayoutVersion(v => v + 1);
    const observer = new ResizeObserver(relayout);
    observer.observe(input);
    input.addEventListener('scroll', relayout);

    return () => {
      observer.disconnect();
      input.removeEventListener('scroll', relayout);
    };
  }, [hasCollaborators]);

  return (
    <div ref={containerRef} className="oak-ash-synced-field oak:relative">
      <TextField { ...props } ref={fieldRef} />
      <FieldCursors cursors={cursors} />
    </div>
  );
};

SyncedTextField.displayName = 'SyncedTextField';

export default SyncedTextField;
