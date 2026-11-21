import {
  type MouseEvent,
  useEffect,
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
import { getCollaboratorColor } from '../collaborators';
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
    collaborators,
    selectedIds,
  } = useEditor();
  const { zoom } = useInfiniteCanvas() || { zoom: 1 };
  const [layoutTick, relayout] = useReducer((x: number) => x + 1, 0);
  const [rects, setRects] = useState<{
    selected: Rect | null;
    /** Other selected elements, when several are selected */
    others: { id: string; rect: Rect }[];
    hovered: Rect | null;
    rows: { id: string; rect: Rect; container: TreeContainer }[];
    collaborators: { key: string; rect: Rect; color: string; name?: string }[];
  }>({
    selected: null,
    others: [],
    hovered: null,
    rows: [],
    collaborators: [],
  });

  const otherSelectedIds = useMemo(() => (
    selectedIds.filter(id => id !== selectedId)
  ), [selectedIds, selectedId]);

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

  // Elements may not be laid out yet when the overlay is mounted (or when
  // collaborators are received): measure again on the next frame
  useEffect(() => {
    const frame = requestAnimationFrame(() => relayout());

    return () => cancelAnimationFrame(frame);
  }, [collaborators]);

  // Re-measure when anything inside the page changes size (images loading,
  // fonts, responsive changes...)
  useLayoutEffect(() => {
    const frame = frameRef.current;

    if (!frame || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => relayout());
    observer.observe(frame);

    [...selectedIds, hoveredId]
      .map(id => findElement(frame, id))
      .filter(Boolean)
      .forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [frameRef, selectedIds, hoveredId, content]);

  useLayoutEffect(() => {
    const frame = frameRef.current;

    setRects({
      selected: measure(frame, findElement(frame, selectedId)),
      others: otherSelectedIds
        .map(id => ({ id, rect: measure(frame, findElement(frame, id)) }))
        .filter(o => o.rect),
      hovered: !selectedIds.includes(hoveredId)
        ? measure(frame, findElement(frame, hoveredId))
        : null,
      rows: rows
        .map(({ node, container }) => ({
          id: node.id,
          container,
          rect: measure(frame, findElement(frame, node.id)),
        }))
        .filter(r => r.rect),
      collaborators: collaborators
        .filter(c => c.selectedId)
        .map(c => ({
          key: String(c.id),
          color: getCollaboratorColor(c),
          name: c.name,
          rect: measure(frame, findElement(frame, c.selectedId)),
        }))
        .filter(c => c.rect),
    });
  }, [
    collaborators,
    frameRef, selectedId, hoveredId, content, pageWidth, layoutTick, tree,
    rows, otherSelectedIds, selectedIds,
  ]);

  // Dragged elements are dimmed
  const isDragged = (id: string) => dragSource?.type === 'element' && (
    dragSource.id === id || !!dragSource.ids?.includes(id)
  );

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

      { rects.collaborators.map(c => (
        <div
          key={c.key}
          className="oak-ash-collaborator oak:absolute oak:border-solid"
          style={{
            left: c.rect.x,
            top: c.rect.y,
            width: c.rect.width,
            height: c.rect.height,
            borderWidth: stroke * 2,
            borderColor: c.color,
            boxSizing: 'border-box',
          }}
        >
          { c.name && (
            <div
              className={classNames(
                'oak:absolute oak:right-0 oak:bottom-full oak:origin-bottom-right',
                'oak:text-onyx oak:whitespace-nowrap oak:px-1.5 oak:py-0.5',
                'oak:rounded-t oak:text-[11px] oak:leading-4',
              )}
              style={{
                background: c.color,
                transform: `scale(${1 / (zoom || 1)})`,
                fontFamily: 'var(--junipero-font-family)',
                marginRight: -stroke * 2,
              }}
            >
              { c.name }
            </div>
          ) }
        </div>
      )) }

      { rects.others.map(o => (
        <div
          key={o.id}
          className="oak:absolute oak:border-velvet oak:border-solid"
          data-oak-selected-outline
          style={{
            left: o.rect.x,
            top: o.rect.y,
            width: o.rect.width,
            height: o.rect.height,
            borderWidth: stroke * 2,
            boxSizing: 'border-box',
            opacity: isDragged(o.id) ? 0.4 : 1,
          }}
        />
      )) }

      { rects.selected && (
        <div
          className="oak:absolute oak:border-velvet oak:border-solid"
          data-oak-selected-outline
          style={{
            left: rects.selected.x,
            top: rects.selected.y,
            width: rects.selected.width,
            height: rects.selected.height,
            borderWidth: stroke * 2,
            boxSizing: 'border-box',
            opacity: isDragged(selectedId) ? 0.4 : 1,
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
