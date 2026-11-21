import type { Node } from '@remirror/pm/model';
import {
  type ComponentPropsWithoutRef,
  type FocusEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type FieldContent, classNames } from '@junipero/react';
import {
  type RemirrorEventListener,
  htmlToProsemirrorNode,
  prosemirrorNodeToHtml,
} from 'remirror';
import { Remirror, EditorComponent, useRemirror } from '@remirror/react';

import type { Extensions, FieldOptions } from '../types';
import { type RemirrorFieldContextValue, RemirrorFieldContext } from './context';
import Menu from './Menu';
import Cursors, { type FieldCursorItem } from './Cursors';
import { measureSelection } from './measure';

export interface RemirrorFieldProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string;
  extensions?(): Extensions[];
  /** Given by oak builders, used for translations */
  fieldOptions?: FieldOptions;
  onChange?(field: FieldContent<string>): void;
}

// Marks transactions applying changes made outside of the editor
const EXTERNAL_CHANGE = 'oakExternalChange';

const RemirrorField = ({
  className,
  value,
  extensions,
  fieldOptions,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: RemirrorFieldProps) => {
  const t = fieldOptions?.t;
  const container = fieldOptions?.floatingsRef?.current || undefined;
  const context = useMemo<RemirrorFieldContextValue>(() => ({
    t: (key, def) => t?.(key, def) ?? def,
    container,
  }), [t, container]);

  const { manager, setState, state } = useRemirror({
    extensions,
    content: value,
    stringHandler: 'html',
    selection: 'end',
  });

  // Last value emitted by (or applied to) the editor
  const lastValue = useRef(value);

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
      const view = manager.view;
      const focused = !!view?.hasFocus();
      const selection = focused
        ? { anchor: view.state.selection.anchor, head: view.state.selection.head }
        : null;
      const serialized = JSON.stringify(selection);

      if (serialized !== lastSelection.current) {
        lastSelection.current = serialized;
        onSelectionChangeRef.current?.(selection);
      }
    });
  }, [manager]);

  useEffect(() => () => cancelAnimationFrame(selectionFrame.current), []);

  const onFocus_ = (e: FocusEvent<HTMLDivElement>) => {
    reportSelection();
    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent<HTMLDivElement>) => {
    reportSelection();
    onBlur?.(e);
  };

  const onChange_ = useCallback<
    RemirrorEventListener<Extensions>
  >(({ state, tr }) => {
    setState(state);
    reportSelection();
    const html = prosemirrorNodeToHtml(state.doc as Node);

    if (tr?.getMeta(EXTERNAL_CHANGE) || html === lastValue.current) {
      lastValue.current = html;

      return;
    }

    lastValue.current = html;
    onChange?.({ value: html });
  }, [setState, onChange, reportSelection]);

  // Changes made outside of the editor (e.g. by another user) are applied as
  // a transaction replacing only the changed part of the document, so that
  // the selection is kept (and moved along with the content changed before it)
  useEffect(() => {
    const view = manager.view;

    if (!view || value === undefined || value === lastValue.current) {
      return;
    }

    lastValue.current = value;

    const next = manager.createState({
      content: value,
      stringHandler: htmlToProsemirrorNode,
    }).doc;
    const current = view.state.doc;
    const start = current.content.findDiffStart(next.content);

    if (start === null || start === undefined) {
      return;
    }

    let { a: endA, b: endB } = current.content.findDiffEnd(next.content);
    const overlap = start - Math.min(endA, endB);

    if (overlap > 0) {
      endA += overlap;
      endB += overlap;
    }

    view.dispatch(
      view.state.tr
        .replace(start, endA, next.slice(start, endB))
        .setMeta(EXTERNAL_CHANGE, true)
        .setMeta('addToHistory', false)
    );
  }, [value, manager]);

  // Other users' cursors
  const collaborators = fieldOptions?.collaborators;
  const [cursors, setCursors] = useState<FieldCursorItem[]>([]);
  const [layoutVersion, setLayoutVersion] = useState(0);

  useLayoutEffect(() => {
    const view = manager.view;
    const container = containerRef.current;

    if (!view || !container || !collaborators?.length) {
      setCursors(c => c.length ? [] : c);

      return;
    }

    setCursors(collaborators.map(c => ({
      ...c,
      ...measureSelection(view, container, c),
    })));
  }, [collaborators, state, manager, layoutVersion]);

  const hasCollaborators = !!collaborators?.length;

  useEffect(() => {
    const dom = manager.view?.dom;

    if (!dom || !hasCollaborators) {
      return;
    }

    const observer = new ResizeObserver(() => setLayoutVersion(v => v + 1));
    observer.observe(dom);

    return () => observer.disconnect();
  }, [manager, hasCollaborators]);

  return (
    <RemirrorFieldContext value={context}>
      <div
        { ...rest }
        ref={containerRef}
        className={classNames('remirror-field', className)}
        onFocus={onFocus_}
        onBlur={onBlur_}
      >
        <Remirror manager={manager} initialContent={state} onChange={onChange_}>
          <Menu />
          <EditorComponent />
        </Remirror>
        <Cursors cursors={cursors} />
      </div>
    </RemirrorFieldContext>
  );
};

RemirrorField.displayName = 'RemirrorField';

export default RemirrorField;
