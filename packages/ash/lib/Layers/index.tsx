import {
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ComponentObject } from '@oakjs/core';
import {
  Draggable,
  Droppable,
  classNames,
} from '@junipero/react';

import type { DragSource, DropTarget } from '../types';
import {
  type TreeContainer,
  type TreeNode,
  getAncestors,
} from '../tree';
import {
  DRAG_DATA_KEY,
  canDrag,
  canDrop,
  commitDrop,
  parseDragData,
} from '../dnd';
import { useBuilder, useEditor } from '../hooks';
import { getSelectedNodes } from '../selection';
import ChevronIcon from '../Icon/ChevronIcon';
import EyeOffIcon from '../Icon/EyeOffIcon';
import {
  getCollaboratorColor,
  getCollaboratorInitial,
  getSelectingCollaborators,
} from '../collaborators';
import Icon from '../Icon';
import Text from '../Text';

const CONTAINER_LABELS: Record<string, [string, string]> = {
  content: ['ash.layers.containers.content', 'Content'],
  seeMore: [
    'core.components.foldable.sectionsTitle.seeMore', 'Label when collapsed',
  ],
  seeLess: [
    'core.components.foldable.sectionsTitle.seeLess', 'Label when expanded',
  ],
};

const INDENT = 12;

const stripHTML = (html: unknown) =>
  typeof html === 'string'
    ? html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ').trim()
    : '';

const useLayerDrop = (getTarget: (after: boolean) => DropTarget | null) => {
  const { builder } = useBuilder();
  const { tree, dragSource, select, selectMany, setDragSource } = useEditor();
  const [position, setPosition] = useState<'before' | 'after' | null>(null);

  const onDragOver = (_: DragEvent, direction: 'before' | 'after') => {
    const target = getTarget(direction === 'after');
    setPosition(
      dragSource && target && canDrop(builder, tree, dragSource, target)
        ? direction : null
    );
  };

  const onDragLeave = () => setPosition(null);

  const onDrop = (data: any, direction: 'before' | 'after', e: DragEvent) => {
    e.stopPropagation();
    setPosition(null);

    const source: DragSource | null = parseDragData(data) || dragSource;
    const target = getTarget(direction === 'after');

    if (source && target) {
      const element = commitDrop(builder, tree, source, target);

      // Moved elements stay selected
      if (source.type === 'element' && (source.ids?.length || 0) > 1) {
        if (element) {
          selectMany(source.ids);
        }
      } else if (element?.id !== undefined) {
        select(String(element.id));
      }
    }

    setDragSource(null);
  };

  return { position, onDragOver, onDragLeave, onDrop };
};

const DropLine = ({ position, indent }: {
  position: 'before' | 'after' | null;
  indent: number;
}) => position ? (
  <div
    className={classNames(
      'oak:absolute oak:right-1 oak:h-0.5 oak:bg-velvet oak:rounded-full',
      'oak:pointer-events-none oak:z-10',
      position === 'before' ? 'oak:-top-px' : 'oak:-bottom-px',
    )}
    style={{ left: indent }}
  />
) : null;

declare interface EmptyContainerRowProps {
  container: TreeContainer;
  depth: number;
}

const EmptyContainerRow = ({ container, depth }: EmptyContainerRowProps) => {
  const drop = useLayerDrop(() => ({
    container: container.elements,
    owner: container.owner,
    containerKey: container.key,
    index: 0,
  }));

  return (
    <Droppable
      onDrop={drop.onDrop}
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
    >
      <div
        className={classNames(
          'oak:relative oak:h-7 oak:flex oak:items-center oak:text-xs',
          'oak:text-ash-text-muted oak:italic oak:rounded',
          { 'oak:bg-ash-accent-soft': drop.position },
        )}
        style={{ paddingLeft: depth * INDENT + 30 }}
      >
        <Text name="ash.canvas.emptyContainer">Empty</Text>
      </div>
    </Droppable>
  );
};

declare interface ContainerGroupProps {
  container: TreeContainer;
  depth: number;
  labelled: boolean;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
}

const ContainerGroup = ({
  container,
  depth,
  labelled,
  collapsed,
  onToggle,
}: ContainerGroupProps) => {
  const label = CONTAINER_LABELS[container.key];
  const childDepth = labelled ? depth + 1 : depth;

  return (
    <>
      { labelled && (
        <div
          className={classNames(
            'oak:h-6 oak:flex oak:items-center oak:text-[11px] oak:uppercase',
            'oak:tracking-wide oak:text-ash-text-muted oak:select-none',
          )}
          style={{ paddingLeft: depth * INDENT + 30 }}
        >
          { label
            ? <Text name={label[0]}>{ label[1] }</Text>
            : container.key }
        </div>
      ) }
      { container.nodes.length === 0 ? (
        <EmptyContainerRow container={container} depth={childDepth} />
      ) : container.nodes.map(child => (
        <Layer
          key={child.id}
          node={child}
          depth={childDepth}
          collapsed={collapsed}
          onToggle={onToggle}
        />
      )) }
    </>
  );
};

declare interface LayerProps {
  node: TreeNode;
  depth: number;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
}

const Layer = ({ node, depth, collapsed, onToggle }: LayerProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { builder } = useBuilder();
  const {
    tree,
    selectedId,
    selectedIds,
    hoveredId,
    collaborators,
    select,
    hover,
    setDragSource,
    isElementDisplayed,
  } = useEditor();
  // Not displayed in the canvas with the previewed states
  const hidden = !isElementDisplayed(node.element);
  const selectingCollaborators = getSelectingCollaborators(
    collaborators, node.id
  );
  const component = builder.getComponent(node.element.type) as ComponentObject;
  const hasChildren = node.containers.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const selected = selectedIds.includes(node.id);
  const draggable = canDrag(builder, node.element);
  const preview = stripHTML(node.element.content);

  const drop = useLayerDrop(after => ({
    container: node.container,
    owner: node.parent,
    containerKey: node.containerKey,
    index: node.index + (after ? 1 : 0),
  }));

  // The last selected element is scrolled into view
  const isPrimary = selectedId === node.id;

  useEffect(() => {
    if (isPrimary) {
      rowRef.current?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [isPrimary]);

  // Dragging one of several selected elements moves all of them
  const getDragSource = (): DragSource => {
    const ids = selected && selectedIds.length > 1
      ? getSelectedNodes(tree, selectedIds)
        .filter(n => canDrag(builder, n.element))
        .map(n => n.id)
      : [];

    return ids.length > 1
      ? { type: 'element', id: node.id, ids }
      : { type: 'element', id: node.id };
  };

  const onClick = (e: MouseEvent) => {
    // Shift/Cmd/Ctrl + click adds to (or removes from) the selection
    select(node.id, { toggle: e.shiftKey || e.metaKey || e.ctrlKey });
  };

  const onToggle_ = (e: MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const icon: ReactNode = typeof component?.icon === 'function'
    ? (component.icon as any).bind(null, component)
    : component?.icon || 'help_circle';

  return (
    <>
      <Droppable
        onDrop={drop.onDrop}
        onDragOver={drop.onDragOver}
        onDragLeave={drop.onDragLeave}
      >
        <Draggable
          disabled={!draggable}
          data={{ [DRAG_DATA_KEY]: getDragSource() }}
          onDragStart={() => setDragSource(getDragSource())}
          onDragEnd={() => setDragSource(null)}
        >
          <div
            ref={rowRef}
            role="treeitem"
            aria-selected={selected}
            aria-expanded={hasChildren ? !isCollapsed : undefined}
            data-hidden={hidden || undefined}
            className={classNames(
              'oak:relative oak:flex oak:items-center oak:gap-1.5 oak:h-7',
              'oak:pr-2 oak:rounded oak:cursor-default oak:select-none',
              'oak:text-[13px] oak:whitespace-nowrap',
              selected
                ? 'oak:bg-ash-accent-soft oak:text-velvet'
                : hoveredId === node.id
                  ? 'oak:bg-ash-muted oak:text-ash-text'
                  : 'oak:text-ash-text',
              'oak:[&.dragged]:opacity-40',
            )}
            style={{ paddingLeft: depth * INDENT + 4 }}
            onClick={onClick}
            onMouseEnter={() => hover(node.id)}
            onMouseLeave={() => hover(null)}
          >
            <DropLine position={drop.position} indent={depth * INDENT + 4} />
            <span
              className={classNames(
                'oak:flex oak:items-center oak:justify-center oak:w-4',
                'oak:h-4 oak:flex-none oak:text-ash-text-muted',
                { 'oak:cursor-pointer': hasChildren },
              )}
              onClick={hasChildren ? onToggle_ : undefined}
            >
              { hasChildren && (
                <ChevronIcon
                  open={!isCollapsed}
                  className="oak:hover:text-ash-text"
                />
              ) }
            </span>
            <Icon
              className={classNames(
                'oak:text-base! oak:flex-none',
                selected ? 'oak:text-velvet' : 'oak:text-ash-text-muted',
                { 'oak:opacity-50': hidden },
              )}
            >
              { icon }
            </Icon>
            <span
              className={classNames(
                // Its full width when possible (the preview is truncated
                // first), truncated otherwise
                'oak:truncate oak:flex-initial oak:min-w-0',
                { 'oak:opacity-50': hidden },
              )}
            >
              { component
                ? <Text>{ component.name || component.id }</Text>
                : node.element.type }
            </span>
            { preview && (
              <span
                className={classNames(
                  'oak:truncate oak:text-ash-text-muted oak:min-w-0',
                  'oak:flex-1',
                  { 'oak:opacity-50': hidden },
                )}
              >
                { preview }
              </span>
            ) }
            { hidden && (
              <span
                className={classNames(
                  'oak:flex oak:flex-none oak:text-ash-text-muted',
                  { 'oak:ml-auto': !selectingCollaborators.length },
                )}
                title={builder.getText?.(
                  'ash.layers.hiddenInPreview', 'Hidden in this preview'
                ) || 'Hidden in this preview'}
                data-testid="LayerHidden"
              >
                <EyeOffIcon size={14} />
              </span>
            ) }
            { selectingCollaborators.length > 0 && (
              <span className="oak:ml-auto oak:flex oak:flex-none oak:-space-x-1 oak:pl-1">
                { selectingCollaborators.map(c => (
                  <span
                    key={c.id}
                    title={c.name}
                    className={classNames(
                      'oak-ash-collaborator-avatar oak:flex oak:items-center',
                      'oak:justify-center oak:w-4 oak:h-4 oak:rounded-full',
                      'oak:text-[9px] oak:font-semibold oak:text-onyx',
                      'oak:ring-2 oak:ring-ash-surface',
                    )}
                    style={{ background: getCollaboratorColor(c) }}
                  >
                    { getCollaboratorInitial(c) }
                  </span>
                )) }
              </span>
            ) }
          </div>
        </Draggable>
      </Droppable>

      { hasChildren && !isCollapsed && node.containers.map(container => (
        <ContainerGroup
          key={container.key}
          container={container}
          depth={depth + 1}
          labelled={node.containers.length > 1}
          collapsed={collapsed}
          onToggle={onToggle}
        />
      )) }
    </>
  );
};

const Layers = () => {
  const { tree, selectedId } = useEditor();
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  const onToggle = useCallback((id: string) => {
    setCollapsed(c => {
      const next = new Set(c);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  // Reveal the selected element
  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const ancestors = getAncestors(tree, selectedId);

    if (ancestors.some(a => collapsed.has(a.id))) {
      setCollapsed(c => {
        const next = new Set(c);
        ancestors.forEach(a => next.delete(a.id));

        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, tree]);

  return (
    <div role="tree" className="oak:flex oak:flex-col oak:p-2 oak:min-w-0">
      <ContainerGroup
        container={tree.root}
        depth={0}
        labelled={false}
        collapsed={collapsed}
        onToggle={onToggle}
      />
    </div>
  );
};

Layers.displayName = 'Layers';

export default Layers;
