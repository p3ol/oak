import {
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  type InfiniteCanvasRef,
  InfiniteCanvas,
  classNames,
} from '@junipero/react';
import { REVEAL_EVENT } from '@oakjs/react-renderer';

import { useBuilder, useEditor } from '../hooks';
import {
  type DomDropResult,
  canDrag,
  commitDrop,
  resolveDomDrop,
} from '../dnd';
import type { DragSource } from '../types';
import { getSelectedNodes } from '../selection';
import { isShortcutScoped } from '../useShortcuts';
import Text from '../Text';
import { getMarqueeRect, getMarqueeSelection } from './marquee';
import Page from './Page';
import Overlay from './Overlay';
import Toolbar from './Toolbar';
import ZoomControls from './ZoomControls';

const DRAG_THRESHOLD = 4;
const FIT_MARGIN = 48;

export declare interface PointerDrag {
  id: string;
  /** Shift/Cmd/Ctrl was held: clicking toggles the element's selection */
  toggle: boolean;
  /** Moved elements, once the drag started */
  source?: DragSource;
  startX: number;
  startY: number;
  started: boolean;
  result: DomDropResult | null;
  frame: number | null;
}

export declare interface MarqueeDrag {
  /** Start point, in page coordinates (follows the canvas if it moves) */
  startX: number;
  startY: number;
  /** Shift/Cmd/Ctrl was held: adds to the current selection */
  toggle: boolean;
  /** Selection when the drag started */
  initial: string[];
  started: boolean;
  frame: number | null;
}

const getElementId = (frame: HTMLElement, target: EventTarget | null) => {
  const el = (target as Element)?.closest?.('[data-oak-id]');

  return el && frame.contains(el) ? el.getAttribute('data-oak-id') : null;
};

const Canvas = () => {
  const canvasRef = useRef<InfiniteCanvasRef>(null);
  const pointerDrag = useRef<PointerDrag | null>(null);
  const marqueeDrag = useRef<MarqueeDrag | null>(null);
  // Selection box, relative to the canvas
  const [marquee, setMarquee] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const {
    builder,
    rootRef,
    renderPageHead,
    shortcutsEnabled = true,
  } = useBuilder();
  const editor = useEditor();
  const {
    tree,
    frameRef,
    activeTool,
    pageWidth,
    previewMode,
    canvasTheme,
    dragSource,
    selectedId,
    selectedIds,
    pageValue,
    select,
    selectMany,
    hover,
    setDragSource,
    setDropIndicator,
  } = editor;

  // Keep the latest values available to window event listeners
  const latest = useRef({ tree, dragSource, builder, selectedIds });
  latest.current = { tree, dragSource, builder, selectedIds };

  const fitWidth = useCallback((duration = 0) => {
    const canvas = canvasRef.current;
    const rect = canvas?.innerRef.current?.getBoundingClientRect();

    if (!canvas || !rect?.width) {
      return;
    }

    const zoom = Math.min(1, (rect.width - FIT_MARGIN * 2) / pageWidth);
    canvas.panAndZoomTo(
      pageWidth / 2,
      (rect.height / 2 - FIT_MARGIN) / zoom,
      zoom,
      duration,
    );
  }, [pageWidth]);

  const mounted = useRef(false);

  // Ask components hiding the selected element (e.g. a collapsed foldable)
  // to display it
  useLayoutEffect(() => {
    const el = selectedId && frameRef.current?.querySelector(
      `[data-oak-id="${CSS.escape(selectedId)}"]`
    ) as HTMLElement | null;

    if (el && el.offsetParent === null) {
      el.dispatchEvent(new CustomEvent(REVEAL_EVENT, { bubbles: true }));
    }
  }, [selectedId, tree, frameRef]);

  // Zoom shortcuts (they would zoom the whole browser page otherwise)
  useEffect(() => {
    if (!shortcutsEnabled) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const canvas = canvasRef.current;
      const mod = e.metaKey || e.ctrlKey;

      if (!canvas || !isShortcutScoped(e, rootRef?.current)) {
        return;
      }

      // Checking both key & code to support every keyboard layout
      if (mod && (
        ['+', '='].includes(e.key) || ['Equal', 'NumpadAdd'].includes(e.code)
      )) {
        e.preventDefault();
        canvas.zoomIn(150);
      } else if (mod && (
        ['-', '_'].includes(e.key) ||
        ['Minus', 'NumpadSubtract'].includes(e.code)
      )) {
        e.preventDefault();
        canvas.zoomOut(150);
      } else if (mod && (
        e.key === '0' || ['Digit0', 'Numpad0'].includes(e.code)
      )) {
        e.preventDefault();
        canvas.setZoom(1, 150);
      } else if (!mod && e.shiftKey && e.code === 'Digit1') {
        e.preventDefault();
        fitWidth(200);
      }
    };

    globalThis.addEventListener('keydown', onKeyDown);

    return () => globalThis.removeEventListener('keydown', onKeyDown);
  }, [shortcutsEnabled, rootRef, fitWidth]);

  useLayoutEffect(() => {
    fitWidth(mounted.current ? 200 : 0);
    mounted.current = true;
  // Only refit when the page width changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageWidth]);

  const onWindowMouseMove = useCallback((e: MouseEvent) => {
    const drag = pointerDrag.current;
    const frame = frameRef.current;

    if (!drag || !frame) {
      return;
    }

    if (!drag.started) {
      if (
        Math.abs(e.clientX - drag.startX) < DRAG_THRESHOLD &&
        Math.abs(e.clientY - drag.startY) < DRAG_THRESHOLD
      ) {
        return;
      }

      const node = latest.current.tree.nodes.get(drag.id);

      if (!node || !canDrag(latest.current.builder, node.element)) {
        pointerDrag.current = null;

        return;
      }

      drag.started = true;

      // Dragging one of several selected elements moves all of them
      const { selectedIds: ids } = latest.current;
      const moved = ids.length > 1 && ids.includes(drag.id)
        ? getSelectedNodes(latest.current.tree, ids)
          .filter(n => canDrag(latest.current.builder, n.element))
          .map(n => n.id)
        : [];

      if (moved.length > 1) {
        drag.source = { type: 'element', id: drag.id, ids: moved };
      } else {
        drag.source = { type: 'element', id: drag.id };
        select(drag.id);
      }

      setDragSource(drag.source);
    }

    const { clientX, clientY } = e;

    if (drag.frame) {
      cancelAnimationFrame(drag.frame);
    }

    drag.frame = requestAnimationFrame(() => {
      drag.frame = null;
      drag.result = resolveDomDrop(
        latest.current.builder,
        latest.current.tree,
        frame,
        drag.source,
        clientX,
        clientY,
      );
      setDropIndicator(drag.result?.indicator || null);
    });
  }, [frameRef, select, setDragSource, setDropIndicator]);

  const onWindowMouseUp = useCallback(() => {
    const drag = pointerDrag.current;

    globalThis.removeEventListener('mousemove', onWindowMouseMove);
    globalThis.removeEventListener('mouseup', onWindowMouseUp);
    pointerDrag.current = null;

    if (!drag) {
      return;
    }

    if (drag.frame) {
      cancelAnimationFrame(drag.frame);
    }

    if (!drag.started) {
      select(drag.id, { toggle: drag.toggle });

      return;
    }

    if (drag.result) {
      const moved = commitDrop(
        latest.current.builder,
        latest.current.tree,
        drag.source,
        drag.result.target,
      );

      // Moved elements stay selected
      if (moved && drag.source.type === 'element' && drag.source.ids) {
        selectMany(drag.source.ids);
      }
    }

    setDragSource(null);
    setDropIndicator(null);
  }, [onWindowMouseMove, select, selectMany, setDragSource, setDropIndicator]);

  useEffect(() => () => {
    globalThis.removeEventListener('mousemove', onWindowMouseMove);
    globalThis.removeEventListener('mouseup', onWindowMouseUp);
  }, [onWindowMouseMove, onWindowMouseUp]);

  /**
   * Scale of the page on screen (zoom), and its position: the selection box
   * start point is stored in page coordinates so that it stays in place if
   * the canvas moves during the drag (e.g. scrolling)
   */
  const getFrameTransform = useCallback(() => {
    const frame = frameRef.current;
    const rect = frame?.getBoundingClientRect();

    return {
      left: rect?.left ?? 0,
      top: rect?.top ?? 0,
      scale: rect?.width && frame?.offsetWidth
        ? rect.width / frame.offsetWidth
        : 1,
    };
  }, [frameRef]);

  const onMarqueeMouseMove = useCallback((e: MouseEvent) => {
    const drag = marqueeDrag.current;
    const frame = frameRef.current;

    if (!drag || !frame) {
      return;
    }

    const { left, top, scale } = getFrameTransform();
    const startX = left + drag.startX * scale;
    const startY = top + drag.startY * scale;

    if (
      !drag.started &&
      Math.abs(e.clientX - startX) < DRAG_THRESHOLD &&
      Math.abs(e.clientY - startY) < DRAG_THRESHOLD
    ) {
      return;
    }

    if (!drag.started) {
      drag.started = true;
      hover(null);
      globalThis.getSelection?.()?.removeAllRanges();
    }

    const rect = getMarqueeRect(startX, startY, e.clientX, e.clientY);
    const canvasRect = canvasRef.current?.innerRef.current
      ?.getBoundingClientRect();

    setMarquee({
      x: rect.left - (canvasRect?.left ?? 0),
      y: rect.top - (canvasRect?.top ?? 0),
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
    });

    if (drag.frame) {
      cancelAnimationFrame(drag.frame);
    }

    drag.frame = requestAnimationFrame(() => {
      drag.frame = null;
      const ids = getMarqueeSelection(frame, latest.current.tree, rect);

      selectMany(drag.toggle
        ? [...drag.initial, ...ids.filter(id => !drag.initial.includes(id))]
        : ids);
    });
  }, [frameRef, getFrameTransform, hover, selectMany]);

  const onMarqueeMouseUp = useCallback(() => {
    const drag = marqueeDrag.current;

    globalThis.removeEventListener('mousemove', onMarqueeMouseMove);
    globalThis.removeEventListener('mouseup', onMarqueeMouseUp);
    marqueeDrag.current = null;
    setMarquee(null);

    if (!drag) {
      return;
    }

    if (drag.frame) {
      cancelAnimationFrame(drag.frame);
    }

    // A simple click on an empty area clears the selection
    if (!drag.started && !drag.toggle) {
      select(null);
    }
  }, [onMarqueeMouseMove, select]);

  useEffect(() => () => {
    globalThis.removeEventListener('mousemove', onMarqueeMouseMove);
    globalThis.removeEventListener('mouseup', onMarqueeMouseUp);
  }, [onMarqueeMouseMove, onMarqueeMouseUp]);

  /**
   * Starts a selection box (mouse down on an empty area of the canvas or of
   * the page), like on a desktop
   */
  const startMarquee = (e: ReactMouseEvent) => {
    const { left, top, scale } = getFrameTransform();

    // Prevents selecting text while dragging, without keeping the focus on a
    // field outside of the canvas (shortcuts would be ignored)
    e.preventDefault();

    if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
    ) {
      document.activeElement.blur();
    }

    marqueeDrag.current = {
      startX: (e.clientX - left) / scale,
      startY: (e.clientY - top) / scale,
      toggle: e.shiftKey || e.metaKey || e.ctrlKey,
      initial: latest.current.selectedIds,
      started: false,
      frame: null,
    };
    globalThis.addEventListener('mousemove', onMarqueeMouseMove);
    globalThis.addEventListener('mouseup', onMarqueeMouseUp);
  };

  const onFrameMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'move' || e.button !== 0) {
      return;
    }

    const id = getElementId(frameRef.current, e.target);

    if (!id) {
      startMarquee(e);

      return;
    }

    // Prevents text selection & native drag of images/links
    e.preventDefault();

    pointerDrag.current = {
      id,
      toggle: e.shiftKey || e.metaKey || e.ctrlKey,
      startX: e.clientX,
      startY: e.clientY,
      started: false,
      result: null,
      frame: null,
    };
    globalThis.addEventListener('mousemove', onWindowMouseMove);
    globalThis.addEventListener('mouseup', onWindowMouseUp);
  };

  const onFrameMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (
      pointerDrag.current?.started ||
      marqueeDrag.current?.started ||
      activeTool !== 'move' ||
      // Keep the current hover while using overlay controls
      (e.target as Element).closest?.('[data-oak-overlay-control]')
    ) {
      return;
    }

    hover(getElementId(frameRef.current, e.target));
  };

  const resolveNativeDrop = (e: DragEvent<HTMLDivElement>) =>
    dragSource && frameRef.current
      ? resolveDomDrop(
        builder, tree, frameRef.current, dragSource, e.clientX, e.clientY,
      )
      : null;

  const onFrameDragOver = (e: DragEvent<HTMLDivElement>) => {
    const result = resolveNativeDrop(e);
    setDropIndicator(result?.indicator || null);

    if (result) {
      e.preventDefault();
      e.dataTransfer.dropEffect = dragSource?.type === 'component'
        ? 'copy' : 'move';
    }
  };

  const onFrameDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!frameRef.current?.contains(e.relatedTarget as Node)) {
      setDropIndicator(null);
    }
  };

  const onFrameDrop = (e: DragEvent<HTMLDivElement>) => {
    const result = resolveNativeDrop(e);
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator(null);

    if (result && dragSource) {
      const element = commitDrop(builder, tree, dragSource, result.target);

      if (element?.id !== undefined) {
        select(String(element.id));
      }
    }

    setDragSource(null);
  };

  // Clicking on the empty canvas (outside of the page & controls) clears the
  // selection, dragging draws a selection box
  const onCanvasMouseDownCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as Element;

    if (
      activeTool === 'move' &&
      e.button === 0 &&
      !frameRef.current?.contains(target) &&
      !target.closest?.('.oak-ash-toolbar, .oak-ash-zoom')
    ) {
      startMarquee(e);
    }
  };

  const frame = (
    <div
      ref={frameRef}
      className={classNames(
        'oak-ash-frame oak:relative oak:flex oak:flex-col',
        previewMode.frameClassName ?? 'oak:bg-cv-page',
        { 'oak:cursor-default': activeTool === 'move' },
      )}
      onMouseDown={onFrameMouseDown}
      onMouseMove={onFrameMouseMove}
      onMouseLeave={() => hover(null)}
      // Links & buttons of the page should never be triggered while
      // editing
      onClickCapture={e => e.preventDefault()}
      onDragOver={onFrameDragOver}
      onDragLeave={onFrameDragLeave}
      onDrop={onFrameDrop}
    >
      { renderPageHead?.(pageValue) }
      <Page />
      <Overlay />
    </div>
  );

  return (
    <InfiniteCanvas
      ref={canvasRef}
      className={classNames(
        'oak-ash-canvas oak:absolute! oak:inset-0 oak:overflow-hidden',
        // Container for the toolbar & zoom controls layout
        'oak:@container',
        'oak:bg-cv-bg',
        { 'oak-ash-canvas-dark': canvasTheme === 'dark' },
      )}
      cursorMode={activeTool === 'pan' ? 'pan' : 'default'}
      center={false}
      minZoom={0.05}
      maxZoom={8}
      background={{
        pattern: 'dot',
        gap: 24,
        size: 1,
        fill: 'var(--ash-canvas-dots)',
      }}
      onMouseDownCapture={onCanvasMouseDownCapture}
      overlay={(
        <>
          <Toolbar />
          <ZoomControls onFitWidth={() => fitWidth(200)} />
          { marquee && (
            <div
              className={classNames(
                // Above the page (canvas content), below the toolbars
                'oak-ash-marquee oak:absolute oak:pointer-events-none oak:z-10',
                'oak:border oak:border-solid oak:border-velvet',
                'oak:bg-velvet/10 oak:box-border',
              )}
              data-oak-marquee="true"
              style={{
                left: marquee.x,
                top: marquee.y,
                width: marquee.width,
                height: marquee.height,
              }}
            />
          ) }
        </>
      )}
    >
      <div className="oak-ash-frame-wrapper" style={{ width: pageWidth }}>
        <div
          className={classNames(
            'oak:flex oak:items-center oak:justify-between oak:pb-2',
            'oak:text-xs oak:text-cv-label oak:select-none',
          )}
        >
          <span><Text>{ previewMode.name }</Text></span>
          <span>{ pageWidth }px</span>
        </div>
        { previewMode.render ? previewMode.render({
          children: frame,
          width: pageWidth,
        }) : frame }
      </div>
    </InfiniteCanvas>
  );
};

Canvas.displayName = 'Canvas';

export default Canvas;
