import type { MouseEvent } from 'react';
import {
  DropdownItem,
  InfiniteCanvasZoom,
  classNames,
  useInfiniteCanvas,
} from '@junipero/react';

import { useBuilder, useEditor } from '../hooks';
import MinusIcon from '../Icon/MinusIcon';
import MoonIcon from '../Icon/MoonIcon';
import PlusIcon from '../Icon/PlusIcon';
import SunIcon from '../Icon/SunIcon';
import Text from '../Text';
import { ToolbarButton } from './Toolbar';

const stop = (e: MouseEvent) => e.stopPropagation();

export declare interface ZoomControlsProps {
  onFitWidth: () => void;
}

const ZoomControls = ({ onFitWidth }: ZoomControlsProps) => {
  const { builder } = useBuilder();
  const { zoomIn, zoomOut } = useInfiniteCanvas();
  const { canvasTheme, setCanvasTheme } = useEditor();
  const dark = canvasTheme === 'dark';

  return (
    <div
      className={classNames(
        'oak-ash-zoom oak:absolute oak:bottom-4 oak:left-4 oak:z-20',
        'oak:flex oak:items-center oak:gap-0.5 oak:p-0.5 oak:bg-ash-surface',
        'oak:rounded-md oak:shadow-sm oak:border oak:border-ash-border',
      )}
      onMouseDown={stop}
      onClick={stop}
    >
      <ToolbarButton
        size="sm"
        title={<Text name="ash.zoom.out">Zoom out</Text>}
        shortcut="⌘-"
        onClick={() => zoomOut(150)}
      >
        <MinusIcon size={14} />
      </ToolbarButton>
      <InfiniteCanvasZoom
        className="oak-ash-zoom-dropdown"
        placement="top-start"
        fitIntoViewText={builder.getText('ash.zoom.fit', 'Fit into view')}
        zoomInText={builder.getText('ash.zoom.in', 'Zoom in')}
        zoomOutText={builder.getText('ash.zoom.out', 'Zoom out')}
      >
        <DropdownItem>
          <a
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              onFitWidth();
            }}
          >
            <Text name="ash.zoom.fitWidth">Fit page width</Text>
          </a>
        </DropdownItem>
      </InfiniteCanvasZoom>
      <ToolbarButton
        size="sm"
        title={<Text name="ash.zoom.in">Zoom in</Text>}
        shortcut="⌘+"
        onClick={() => zoomIn(150)}
      >
        <PlusIcon size={14} />
      </ToolbarButton>
      <div className="oak:w-px oak:h-4 oak:bg-ash-border oak:mx-0.5" />
      <ToolbarButton
        size="sm"
        label={dark
          ? builder.getText('ash.canvas.lightMode', 'Preview in light mode')
          : builder.getText('ash.canvas.darkMode', 'Preview in dark mode')}
        title={dark
          ? <Text name="ash.canvas.lightMode">Preview in light mode</Text>
          : <Text name="ash.canvas.darkMode">Preview in dark mode</Text>}
        onClick={() => setCanvasTheme(dark ? 'light' : 'dark')}
      >
        { /* Displays the current theme */ }
        { dark ? <MoonIcon size={14} /> : <SunIcon size={14} /> }
      </ToolbarButton>
    </div>
  );
};

ZoomControls.displayName = 'ZoomControls';

export default ZoomControls;
