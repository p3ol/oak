import {
  type MouseEvent,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Tooltip, classNames, useInfiniteCanvas } from '@junipero/react';

import { useBuilder, useEditor } from '../hooks';
import {
  addStructuralChild,
  getClosestStructuralOwner,
  toFrameRect,
} from '../dnd';
import type { TreeContainer } from '../tree';
import PlusIcon from '../Icon/PlusIcon';
import Text from '../Text';

declare interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const findElement = (frame: HTMLElement | null, id: string | null) =>
  frame && id
    ? frame.querySelector<HTMLElement>(`[data-oak-id="${CSS.escape(id)}"]`)
    : null;

const measure = (frame: HTMLElement | null, el: HTMLElement | null) => {
  if (!frame || !el || el.offsetParent === null) {
    return null;
  }

  return toFrameRect(frame, el.getBoundingClientRect());
};

const ADD_BUTTON_SIZE = 20;
const ADD_BUTTON_GAP = 6;

declare interface AddColumnButtonProps {
  rect: Rect;
  side: 'before' | 'after';
  zoom: number;
  container: TreeContainer;
}

const stop = (e: MouseEvent) => e.stopPropagation();

/**
 * Button displayed outside of a row (left & right) to add a column
 */
const AddColumnButton = ({ rect, side, zoom, container }: AddColumnButtonProps) => {
  const { builder, floatingsRef } = useBuilder();
  const { select } = useEditor();
  const scale = 1 / (zoom || 1);
  const offset = (ADD_BUTTON_SIZE + ADD_BUTTON_GAP) * scale;

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    const col = addStructuralChild(builder, container, side);

    if (col?.id !== undefined) {
      select(String(col.id));
    }
  };

  return (
    <Tooltip
      container={floatingsRef?.current}
      placement={side === 'before' ? 'left' : 'right'}
      text={<Text name="core.tooltips.addColumn">Add column</Text>}
    >
      <button
        type="button"
        data-oak-overlay-control="true"
        aria-label="Add column"
        className={classNames(
          'oak:absolute oak:flex oak:items-center oak:justify-center',
          'oak:rounded-full oak:border-0 oak:p-0 oak:cursor-pointer',
          'oak:bg-velvet oak:text-seashell oak:shadow-sm oak:pointer-events-auto',
          'oak:hover:bg-velvet-hover',
        )}
        style={{
          width: ADD_BUTTON_SIZE,
          height: ADD_BUTTON_SIZE,
          left: side === 'before'
            ? rect.x - offset
            : rect.x + rect.width + ADD_BUTTON_GAP * scale,
          top: rect.y + rect.height / 2 - (ADD_BUTTON_SIZE * scale) / 2,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
        onMouseDown={stop}
        onClick={onClick}
      >
        <PlusIcon size={14} />
      </button>
    </Tooltip>
  );
};

/**
 * Draws hover/selection outlines & drop indicators on top of the page.
 * Outlines are measured from the real DOM so the page itself doesn't need
 * any builder-specific wrapper.
 */
const Overlay = () => {
  const { builder, content } = useBuilder();
  const {
    frameRef,
    selectedId,
    hoveredId,
    dragSource,
    dropIndicator,
    pageWidth,
    tree,
  } = useEditor();
  const { zoom } = useInfiniteCanvas() || { zoom: 1 };
  const [layoutTick, relayout] = useReducer((x: number) => x + 1, 0);
  const [rects, setRects] = useState<{
    selected: Rect | null;
    hovered: Rect | null;
    rows: { id: string; rect: Rect; container: TreeContainer }[];
  }>({ selected: null, hovered: null, rows: [] });

  // Rows (or any element with structural children) related to the selected
  // or hovered element display buttons to add columns
  const rows = useMemo(() => {
    const found = [selectedId, hoveredId]
      .map(id => getClosestStructuralOwner(builder, tree, id))
      .filter(Boolean);

    return found.filter((r, i) =>
      found.findIndex(o => o.node.id === r.node.id) === i
    );
  }, [builder, tree, selectedId, hoveredId]);

  // Re-measure when anything inside the page changes size (images loading,
  // fonts, responsive changes...)
  useLayoutEffect(() => {
    const frame = frameRef.current;

    if (!frame || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => relayout());
    observer.observe(frame);

    const selected = findElement(frame, selectedId);
    const hovered = findElement(frame, hoveredId);

    if (selected) {
      observer.observe(selected);
    }

    if (hovered) {
      observer.observe(hovered);
    }

    return () => observer.disconnect();
  }, [frameRef, selectedId, hoveredId, content]);

  useLayoutEffect(() => {
    const frame = frameRef.current;

    setRects({
      selected: measure(frame, findElement(frame, selectedId)),
      hovered: hoveredId !== selectedId
        ? measure(frame, findElement(frame, hoveredId))
        : null,
      rows: rows
        .map(({ node, container }) => ({
          id: node.id,
          container,
          rect: measure(frame, findElement(frame, node.id)),
        }))
        .filter(r => r.rect),
    });
  }, [
    frameRef, selectedId, hoveredId, content, pageWidth, layoutTick, tree,
    rows,
  ]);

  const stroke = 1 / (zoom || 1);
  const selectedNode = selectedId ? tree.nodes.get(selectedId) : null;
  const selectedComponent = selectedNode
    ? builder.getComponent(selectedNode.element.type)
    : null;

  return (
    <div
      className={classNames(
        'oak-ash-overlay oak:absolute oak:inset-0 oak:pointer-events-none',
        'oak:z-10',
      )}
    >
      { rects.hovered && !dragSource && (
        <div
          className="oak:absolute oak:border-velvet oak:border-solid"
          style={{
            left: rects.hovered.x,
            top: rects.hovered.y,
            width: rects.hovered.width,
            height: rects.hovered.height,
            borderWidth: stroke,
            boxSizing: 'border-box',
          }}
        />
      ) }

      { rects.selected && (
        <div
          className="oak:absolute oak:border-velvet oak:border-solid"
          style={{
            left: rects.selected.x,
            top: rects.selected.y,
            width: rects.selected.width,
            height: rects.selected.height,
            borderWidth: stroke * 2,
            boxSizing: 'border-box',
            opacity: dragSource?.type === 'element' &&
              dragSource.id === selectedId ? 0.4 : 1,
          }}
        >
          <div
            className={classNames(
              'oak:absolute oak:left-0 oak:bottom-full oak:origin-bottom-left',
              'oak:bg-velvet oak:text-seashell oak:whitespace-nowrap',
              'oak:px-1.5 oak:py-0.5 oak:rounded-t oak:text-[11px]',
              'oak:leading-4',
            )}
            style={{
              transform: `scale(${1 / (zoom || 1)})`,
              fontFamily: 'var(--junipero-font-family)',
              marginLeft: -stroke * 2,
            }}
          >
            { selectedComponent ? (
              <Text>{ selectedComponent.name || selectedComponent.id }</Text>
            ) : (
              selectedNode?.element.type
            ) }
          </div>
        </div>
      ) }

      { !dragSource && rects.rows.map(row => (
        <div key={row.id}>
          <AddColumnButton
            rect={row.rect}
            side="before"
            zoom={zoom}
            container={row.container}
          />
          <AddColumnButton
            rect={row.rect}
            side="after"
            zoom={zoom}
            container={row.container}
          />
        </div>
      )) }

      { dropIndicator && (
        <div
          className={classNames(
            'oak:absolute',
            dropIndicator.kind === 'line'
              ? 'oak:bg-velvet'
              : 'oak:bg-velvet/10 oak:border-velvet oak:border-dashed',
          )}
          style={{
            left: dropIndicator.x,
            top: dropIndicator.y,
            width: dropIndicator.kind === 'line' && dropIndicator.width <= 2
              ? Math.max(dropIndicator.width, stroke * 2)
              : dropIndicator.width,
            height: dropIndicator.kind === 'line' && dropIndicator.height <= 2
              ? Math.max(dropIndicator.height, stroke * 2)
              : dropIndicator.height,
            ...dropIndicator.kind === 'box' && {
              borderWidth: stroke * 2,
              boxSizing: 'border-box',
            },
          }}
        />
      ) }
    </div>
  );
};

Overlay.displayName = 'Overlay';

export default Overlay;
