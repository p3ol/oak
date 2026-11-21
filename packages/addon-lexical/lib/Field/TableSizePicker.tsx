import {
  type KeyboardEvent,
  type MouseEvent,
  useRef,
  useState,
} from 'react';
import { classNames } from '@junipero/react';

import { useLexicalField } from './context';

export declare interface TableSizePickerProps {
  /** Maximum number of rows & columns (default: 6) */
  max?: number;
  onSelect(rows: number, columns: number): void;
}

/**
 * Grid of cells to choose the size of a new table (like CKEditor's): cells
 * are highlighted from the top left corner to the hovered one
 */
const TableSizePicker = ({ max = 6, onSelect }: TableSizePickerProps) => {
  const { t } = useLexicalField();
  const gridRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ rows: 1, columns: 1 });
  const cells = Array.from({ length: max }, (_, i) => i + 1);

  const focusCell = (rows: number, columns: number) => {
    gridRef.current
      ?.querySelector<HTMLButtonElement>(
        `[data-rows="${rows}"][data-columns="${columns}"]`
      )
      ?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const move = moves[e.key];

    if (!move) {
      return;
    }

    e.preventDefault();
    focusCell(
      Math.min(max, Math.max(1, size.rows + move[0])),
      Math.min(max, Math.max(1, size.columns + move[1])),
    );
  };

  const label = (rows: number, columns: number) => t(
    'addons.lexical.fields.editor.tables.size', '{rows} × {columns}'
  ).replace('{rows}', String(rows)).replace('{columns}', String(columns));

  return (
    <li className="oak-lexical-table-picker">
      <div
        ref={gridRef}
        role="grid"
        className="oak-lexical-table-grid"
        style={{ gridTemplateColumns: `repeat(${max}, auto)` }}
        onKeyDown={onKeyDown}
      >
        { cells.map(rows => cells.map(columns => (
          <button
            key={`${rows}-${columns}`}
            type="button"
            data-rows={rows}
            data-columns={columns}
            aria-label={label(rows, columns)}
            tabIndex={rows === size.rows && columns === size.columns ? 0 : -1}
            className={classNames('oak-lexical-table-cell', {
              active: rows <= size.rows && columns <= size.columns,
            })}
            onMouseEnter={() => setSize({ rows, columns })}
            onFocus={() => setSize({ rows, columns })}
            onMouseDown={(e: MouseEvent) => e.preventDefault()}
            onClick={() => onSelect(rows, columns)}
          />
        ))) }
      </div>
      <div className="oak-lexical-table-size" aria-live="polite">
        { label(size.rows, size.columns) }
      </div>
    </li>
  );
};

TableSizePicker.displayName = 'TableSizePicker';

export default TableSizePicker;
