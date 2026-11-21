import { type RefObject, useEffect, useRef } from 'react';
import type { Builder } from '@oakjs/core';

import type { EditorContextValue } from './contexts';
import { isTypingTarget } from './utils';
import {
  parseClipboardElements,
  pasteElements,
  serializeElements,
} from './clipboard';

/**
 * Only handle shortcuts when the builder (or nothing in particular) is
 * focused and the user is not typing, so that multiple builders or host
 * inputs are not affected
 */
export const isShortcutScoped = (
  e: Event,
  root: HTMLElement | null,
) => !isTypingTarget(e.target) && isBuilderActive(root);

/**
 * Whether the builder should handle keyboard shortcuts: when the focus is
 * inside it, or when nothing is focused and the builder was the last thing
 * the user interacted with (in case there are several builders on the page)
 */
export const isBuilderActive = (root: HTMLElement | null) => {
  const active = document.activeElement;

  if (root?.contains(active)) {
    return true;
  }

  return (!active || active === document.body) &&
    root?.dataset.oakActive !== 'false';
};

/**
 * Marks the builder as active/inactive depending on where the user last
 * clicked (see isBuilderActive)
 */
export const useInteractionTracking = (root: RefObject<HTMLElement>) => {
  useEffect(() => {
    const onPointerDown = (e: Event) => {
      if (root.current) {
        root.current.dataset.oakActive = String(
          root.current.contains(e.target as Node)
        );
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [root]);
};

const hasTextSelection = () =>
  !!globalThis.getSelection?.()?.toString();

/**
 * Figma-like keyboard shortcuts:
 * - V / H: move & hand tools, hold space to pan temporarily
 * - Backspace / Delete: remove the selected element
 * - Cmd/Ctrl + D: duplicate the selected element
 * - Cmd/Ctrl + Z / Shift + Cmd/Ctrl + Z: undo / redo
 * - Escape: select the parent element (or clear selection)
 * - Cmd/Ctrl + C / X / V: copy, cut & paste elements
 * - Cmd/Ctrl + S: save (if `onSave` is set), even while typing in a field
 *
 * Zoom shortcuts are handled by the canvas.
 */
export const useShortcuts = ({
  rootRef,
  builder,
  editor,
  setTemporaryPan,
  undo,
  redo,
  save,
  enabled = true,
}: {
  rootRef: RefObject<HTMLElement>;
  builder: Builder;
  editor: EditorContextValue;
  setTemporaryPan: (enabled: boolean) => void;
  undo: () => void;
  redo: () => void;
  save?: () => void;
  enabled?: boolean;
}) => {
  const latest = useRef(editor);
  latest.current = editor;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const isScoped = (e: Event) => isShortcutScoped(e, rootRef.current);

    // Clipboard events are used rather than keyboard shortcuts to read &
    // write the clipboard without asking for permissions
    const onCopy = (e: ClipboardEvent, cut = false) => {
      if (!isScoped(e) || hasTextSelection()) {
        return;
      }

      const { tree, selectedId, select } = latest.current;
      const node = selectedId ? tree.nodes.get(selectedId) : null;

      if (!node) {
        return;
      }

      const component = builder.getComponent(node.element.type);
      const override: any = builder.getOverride('component', node.element.type);

      if ((override?.copyable ?? component?.copyable) === false) {
        return;
      }

      e.preventDefault();
      e.clipboardData?.setData('text/plain', serializeElements([node.element]));

      if (cut && (override?.removable ?? component?.removable) !== false) {
        select(node.parent ? String(node.parent.id) : null);
        builder.removeElement(node.element.id, { parent: node.container });
      }
    };

    const onCut = (e: ClipboardEvent) => onCopy(e, true);

    const onPaste = (e: ClipboardEvent) => {
      if (!isScoped(e)) {
        return;
      }

      const elements = parseClipboardElements(
        builder, e.clipboardData?.getData('text/plain')
      );

      if (!elements.length) {
        return;
      }

      e.preventDefault();

      const { tree, selectedId, select } = latest.current;
      const added = pasteElements(builder, tree, selectedId, elements);

      if (added?.[0]?.id !== undefined) {
        select(String(added[0].id));
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Saving also works while typing in a field of the builder
      if (
        save &&
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        (e.key.toLowerCase() === 's' || e.code === 'KeyS')
      ) {
        if (isBuilderActive(rootRef.current)) {
          // Prevents the browser's "Save page" dialog
          e.preventDefault();
          save();
        }

        return;
      }

      if (!isScoped(e)) {
        return;
      }

      const { tree, selectedId, select, setTool } = latest.current;
      const mod = e.metaKey || e.ctrlKey;
      const node = selectedId ? tree.nodes.get(selectedId) : null;

      if (e.code === 'Space' && !mod) {
        e.preventDefault();

        if (!e.repeat) {
          setTemporaryPan(true);
        }

        return;
      }

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();

        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }

        return;
      }

      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();

        return;
      }

      if (mod && e.key.toLowerCase() === 'd' && node) {
        e.preventDefault();
        const component = builder.getComponent(node.element.type);
        const override: any = builder.getOverride('component', node.element.type);

        if (override?.duplicable ?? component?.duplicable) {
          const duplicated = builder.duplicateElement(node.element, {
            parent: node.container,
          });

          if (duplicated) {
            select(String(duplicated.id));
          }
        }

        return;
      }

      if (mod) {
        return;
      }

      switch (e.key) {
        case 'v':
        case 'V':
          setTool('move');
          break;
        case 'h':
        case 'H':
          setTool('pan');
          break;
        case 'Escape':
          select(node?.parent ? String(node.parent.id) : null);
          break;
        case 'Backspace':
        case 'Delete': {
          if (!node) {
            break;
          }

          const component = builder.getComponent(node.element.type);
          const override: any = builder
            .getOverride('component', node.element.type);

          if ((override?.removable ?? component?.removable) !== false) {
            e.preventDefault();
            select(node.parent ? String(node.parent.id) : null);
            builder.removeElement(node.element.id, { parent: node.container });
          }

          break;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setTemporaryPan(false);
      }
    };

    const onBlur = () => setTemporaryPan(false);

    globalThis.addEventListener('keydown', onKeyDown);
    globalThis.addEventListener('keyup', onKeyUp);
    globalThis.addEventListener('blur', onBlur);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCut);
    document.addEventListener('paste', onPaste);

    return () => {
      globalThis.removeEventListener('keydown', onKeyDown);
      globalThis.removeEventListener('keyup', onKeyUp);
      globalThis.removeEventListener('blur', onBlur);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCut);
      document.removeEventListener('paste', onPaste);
    };
  }, [enabled, builder, rootRef, setTemporaryPan, undo, redo, save]);
};
