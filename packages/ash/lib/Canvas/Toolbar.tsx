import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Tooltip, classNames } from '@junipero/react';

import type { Tool } from '../types';
import { useBuilder, useEditor } from '../hooks';
import MoveToolIcon from '../Icon/MoveToolIcon';
import PanToolIcon from '../Icon/PanToolIcon';
import PlusIcon from '../Icon/PlusIcon';
import Icon from '../Icon';
import Insert from '../Insert';
import Text from '../Text';

const stop = (e: MouseEvent) => e.stopPropagation();

export declare interface ToolbarButtonProps {
  active?: boolean;
  size?: 'sm' | 'md';
  /** Accessible name of the button (the title is only a tooltip) */
  label?: string;
  disabled?: boolean;
  title: ReactNode;
  shortcut?: string;
  children: ReactNode;
  onClick: () => void;
}

export const ToolbarButton = ({
  active,
  size = 'md',
  label,
  disabled,
  title,
  shortcut,
  children,
  onClick,
}: ToolbarButtonProps) => {
  const { floatingsRef } = useBuilder();

  return (
    <Tooltip
      container={floatingsRef?.current}
      placement="top"
      disabled={disabled}
      text={(
        <span className="oak:flex oak:items-center oak:gap-2">
          { title }
          { shortcut && <span className="oak:opacity-60">{ shortcut }</span> }
        </span>
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={active}
        aria-label={label}
        onClick={onClick}
        className={classNames(
          'oak:flex oak:items-center oak:justify-center',
          size === 'sm' ? 'oak:w-6 oak:h-6 oak:rounded' : 'oak:w-8 oak:h-8',
          'oak:rounded-md oak:border-0 oak:cursor-pointer oak:transition-colors',
          'oak:disabled:opacity-40 oak:disabled:cursor-default',
          active
            ? 'oak:bg-velvet oak:text-seashell'
            : 'oak:bg-transparent oak:text-ash-text oak:enabled:hover:bg-ash-muted',
        )}
      >
        { children }
      </button>
    </Tooltip>
  );
};

const Separator = () => (
  <div className="oak:w-px oak:h-5 oak:bg-ash-border oak:mx-1" />
);

/**
 * Components catalogue displayed above the toolbar
 */
const CataloguePopover = ({ onClose }: { onClose: () => void }) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    // The canvas captures wheel events to pan/zoom, the catalogue needs to
    // be scrollable
    const onWheel = (e: WheelEvent) => e.stopPropagation();
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

    const onMouseDown = (e: Event) => {
      if (!el?.parentElement?.contains(e.target as Node)) {
        onClose();
      }
    };

    el?.addEventListener('wheel', onWheel);
    globalThis.addEventListener('keydown', onKeyDown);
    globalThis.addEventListener('mousedown', onMouseDown, true);

    return () => {
      el?.removeEventListener('wheel', onWheel);
      globalThis.removeEventListener('keydown', onKeyDown);
      globalThis.removeEventListener('mousedown', onMouseDown, true);
    };
  }, [onClose]);

  return (
    <div
      ref={innerRef}
      className={classNames(
        'oak:absolute oak:bottom-full oak:left-0 oak:mb-2 oak:w-[300px]',
        'oak:max-h-[min(480px,60vh)] oak:overflow-y-auto oak:bg-ash-surface',
        'oak:rounded-lg oak:shadow-lg oak:border oak:border-ash-border',
      )}
    >
      <Insert compact onInsert={onClose} />
    </div>
  );
};

const Toolbar = () => {
  const { builder, canUndo, canRedo, undo, redo } = useBuilder();
  const { activeTool, setTool } = useEditor();
  const [catalogueOpened, setCatalogueOpened] = useState(false);
  const closeCatalogue = useCallback(() => setCatalogueOpened(false), []);

  const tools: { id: Tool; title: ReactNode; shortcut: string; icon: ReactNode }[] = [{
    id: 'move',
    title: <Text name="ash.tools.move">Move</Text>,
    shortcut: 'V',
    icon: <MoveToolIcon />,
  }, {
    id: 'pan',
    title: <Text name="ash.tools.pan">Hand tool</Text>,
    shortcut: 'H',
    icon: <PanToolIcon />,
  }];

  return (
    <div
      className={classNames(
        'oak-ash-toolbar oak:absolute oak:bottom-4 oak:left-1/2',
        'oak:-translate-x-1/2 oak:z-20 oak:flex oak:items-center oak:gap-1',
        // Not enough room to be centered next to the zoom controls
        'oak:@max-[600px]:left-auto oak:@max-[600px]:right-4',
        'oak:@max-[600px]:translate-x-0',
        'oak:p-1 oak:bg-ash-surface oak:rounded-lg oak:shadow-md',
        'oak:border oak:border-ash-border',
      )}
      onMouseDown={stop}
      onClick={stop}
    >
      <ToolbarButton
        active={catalogueOpened}
        title={<Text name="ash.tools.insert">Insert component</Text>}
        onClick={() => setCatalogueOpened(o => !o)}
      >
        <PlusIcon />
      </ToolbarButton>
      { catalogueOpened && (
        <CataloguePopover onClose={closeCatalogue} />
      ) }
      <Separator />
      { tools.map(t => (
        <ToolbarButton
          key={t.id}
          active={activeTool === t.id}
          title={t.title}
          shortcut={t.shortcut}
          onClick={() => setTool(t.id)}
        >
          { t.icon }
        </ToolbarButton>
      )) }
      <Separator />
      <ToolbarButton
        disabled={!canUndo}
        label={builder.getText('core.tooltips.undo', 'Undo')}
        title={<Text name="core.tooltips.undo">Undo</Text>}
        shortcut="⌘Z"
        onClick={() => undo()}
      >
        <Icon className="oak:text-lg!">undo</Icon>
      </ToolbarButton>
      <ToolbarButton
        disabled={!canRedo}
        label={builder.getText('core.tooltips.redo', 'Redo')}
        title={<Text name="core.tooltips.redo">Redo</Text>}
        shortcut="⇧⌘Z"
        onClick={() => redo()}
      >
        <Icon className="oak:text-lg!">redo</Icon>
      </ToolbarButton>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
