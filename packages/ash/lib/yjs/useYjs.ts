import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Y from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
import type { ElementObject } from '@oakjs/core';

import type {
  Collaborator,
  FieldCursor,
  HistoryController,
  PageValue,
} from '../types';
import {
  type YjsKeys,
  getYContent,
  getYPage,
  normalize,
  syncArray,
  syncMap,
} from './sync';

export declare interface YjsUser {
  name?: string;
  /** Any css color. Defaults to a color derived from the awareness id */
  color?: string;
}

export declare interface UseYjsOptions extends YjsKeys {
  /** The shared document */
  doc: Y.Doc;
  /** Awareness instance (from `y-protocols/awareness`) to share selections */
  awareness?: Awareness;
  /** Local user, displayed to the other users */
  user?: YjsUser;
  /**
   * Content used to initialize the document if it is empty. Beware of
   * initializing the document from several clients at the same time: prefer
   * initializing it once (e.g. on your server, with `setYjsContent`).
   */
  defaultValue?: ElementObject[];
  /**
   * Changes made within this delay are undone together (default: 500ms, see
   * Y.UndoManager)
   */
  captureTimeout?: number;
}

/** Props to give to the `Builder` */
export declare interface YjsBuilderProps {
  value: ElementObject[];
  onChange(content: ElementObject[]): void;
  pageValue: PageValue;
  onPageChange(value: PageValue): void;
  history: HistoryController;
  onSelectionChange(id: string | null): void;
  onCursorChange(cursor: FieldCursor | null): void;
  collaborators: Collaborator[];
}

declare interface AwarenessState {
  user?: YjsUser;
  selectedId?: string | null;
  cursor?: FieldCursor | null;
}

/**
 * Synchronizes the builder with a Yjs document: content & page settings are
 * shared, undo/redo only applies to the local user's changes, and selections
 * & cursors in fields are shared through the awareness (if given).
 *
 * ```tsx
 * const collaboration = useYjs({ doc, awareness, user: { name: 'Alice' } });
 *
 * <Builder addons={addons} { ...collaboration } />
 * ```
 */
export const useYjs = ({
  doc,
  awareness,
  user,
  defaultValue,
  captureTimeout,
  contentKey,
  pageKey,
}: UseYjsOptions): YjsBuilderProps => {
  // Transactions made by this hook, ignored by its own observers and tracked
  // by its undo manager
  const origin = useMemo(() => ({ oakAsh: true }), []);
  const yContent = useMemo(() => getYContent(doc, { contentKey }), [
    doc, contentKey,
  ]);
  const yPage = useMemo(() => getYPage(doc, { pageKey }), [doc, pageKey]);

  const [value, setValue] = useState<ElementObject[]>(() => (
    yContent.length ? yContent.toJSON() : normalize(defaultValue) || []
  ));
  const [pageValue, setPageValue] = useState<PageValue>(() => yPage.toJSON());

  // Initialize the document (not undoable)
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    if (!yContent.length && defaultValueRef.current?.length) {
      doc.transact(() => {
        syncArray(yContent, normalize(defaultValueRef.current));
      });
    }
  }, [doc, yContent]);

  // Remote changes (other users, undo/redo)
  useEffect(() => {
    const onContentChange = (_: unknown, transaction: Y.Transaction) => {
      if (transaction.origin !== origin) {
        setValue(yContent.toJSON());
      }
    };

    const onPageChange = (_: unknown, transaction: Y.Transaction) => {
      if (transaction.origin !== origin) {
        setPageValue(yPage.toJSON());
      }
    };

    yContent.observeDeep(onContentChange);
    yPage.observeDeep(onPageChange);

    return () => {
      yContent.unobserveDeep(onContentChange);
      yPage.unobserveDeep(onPageChange);
    };
  }, [yContent, yPage, origin]);

  const onChange = useCallback((content: ElementObject[]) => {
    doc.transact(() => syncArray(yContent, normalize(content)), origin);
  }, [doc, yContent, origin]);

  const onPageChange = useCallback((page: PageValue) => {
    setPageValue(page);
    doc.transact(() => syncMap(yPage, normalize(page)), origin);
  }, [doc, yPage, origin]);

  // Undo/redo of the local changes only. Created in an effect so that it is
  // properly destroyed & re-created (e.g. with React's strict mode)
  const [undoManager, setUndoManager] = useState<Y.UndoManager | null>(null);
  const [stack, setStack] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    const manager = new Y.UndoManager([yContent, yPage], {
      trackedOrigins: new Set([origin]),
      captureTimeout,
    });

    const update = () => setStack({
      canUndo: manager.canUndo(),
      canRedo: manager.canRedo(),
    });

    manager.on('stack-item-added', update);
    manager.on('stack-item-popped', update);
    manager.on('stack-cleared', update);
    setUndoManager(manager);
    update();

    return () => {
      manager.destroy();
    };
  }, [yContent, yPage, origin, captureTimeout]);

  const history = useMemo<HistoryController>(() => ({
    canUndo: stack.canUndo,
    canRedo: stack.canRedo,
    undo: () => undoManager?.undo(),
    redo: () => undoManager?.redo(),
  }), [stack, undoManager]);

  // Presence
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const userName = user?.name;
  const userColor = user?.color;

  useEffect(() => {
    if (awareness && (userName || userColor)) {
      awareness.setLocalStateField('user', { name: userName, color: userColor });
    }
  }, [awareness, userName, userColor]);

  useEffect(() => {
    if (!awareness) {
      return;
    }

    let previous = '';

    const update = () => {
      const states = awareness.getStates() as Map<number, AwarenessState>;
      const next = Array.from(states.entries())
        .filter(([id, state]) => id !== awareness.clientID && state?.user)
        .map(([id, state]) => ({
          id,
          name: state.user?.name,
          color: state.user?.color,
          selectedId: state.selectedId ?? null,
          cursor: state.cursor ?? null,
        }));
      const serialized = JSON.stringify(next);

      // Local changes also trigger an update
      if (serialized !== previous) {
        previous = serialized;
        setCollaborators(next);
      }
    };

    update();
    awareness.on('change', update);

    return () => awareness.off('change', update);
  }, [awareness]);

  const onSelectionChange = useCallback((id: string | null) => {
    awareness?.setLocalStateField('selectedId', id);
  }, [awareness]);

  const onCursorChange = useCallback((cursor: FieldCursor | null) => {
    awareness?.setLocalStateField('cursor', cursor);
  }, [awareness]);

  return {
    value,
    onChange,
    pageValue,
    onPageChange,
    history,
    onSelectionChange,
    onCursorChange,
    collaborators,
  };
};
