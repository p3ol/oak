import { Fragment, useEffect, useRef, useState } from 'react';

import type { FieldCollaborator } from '../../types';

export declare interface FieldCursorRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export declare interface FieldCursorItem extends FieldCollaborator {
  /** Caret position, relative to the cursors container */
  caret: FieldCursorRect | null;
  /** Selected parts, relative to the cursors container */
  selection: FieldCursorRect[];
}

export declare interface FieldCursorsProps {
  cursors: FieldCursorItem[];
  /** How long names stay visible after a cursor moved (default: 2000ms) */
  labelDuration?: number;
}

/**
 * Displays the carets & selections of other users over a field. Must be
 * rendered inside a positioned container, the rects being relative to it.
 * Styles are inline so that fields from other packages can copy it.
 */
const FieldCursors = ({ cursors, labelDuration = 2000 }: FieldCursorsProps) => {
  // Names are displayed when a cursor moves, then hidden so that they don't
  // hide the text
  const positions = useRef(new Map<string | number, string>());
  const [labels, setLabels] = useState<Record<string, number>>({});

  useEffect(() => {
    const now = Date.now();
    const moved: Record<string, number> = {};

    cursors.forEach(c => {
      const position = `${c.anchor}:${c.head}`;

      if (positions.current.get(c.id) !== position) {
        positions.current.set(c.id, position);
        moved[c.id] = now;
      }
    });

    if (Object.keys(moved).length) {
      setLabels(l => ({ ...l, ...moved }));
    }
  }, [cursors]);

  useEffect(() => {
    const ids = Object.keys(labels);

    if (!ids.length) {
      return;
    }

    const next = Math.min(...ids.map(id => labels[id])) + labelDuration;
    const timeout = setTimeout(() => {
      const now = Date.now();

      setLabels(l => Object.fromEntries(
        Object.entries(l).filter(([, t]) => now - t < labelDuration)
      ));
    }, Math.max(0, next - Date.now()) + 16);

    return () => clearTimeout(timeout);
  }, [labels, labelDuration]);

  if (!cursors.length) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="oak-ash-field-cursors"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    >
      { cursors.map(c => (
        <Fragment key={c.id}>
          { c.selection.map((rect, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...rect,
                background: `color-mix(in srgb, ${c.color} 30%, transparent)`,
              }}
            />
          )) }
          { c.caret && (
            <div
              style={{
                position: 'absolute',
                top: c.caret.top,
                left: c.caret.left - 1,
                width: 2,
                height: c.caret.height,
                background: c.color,
              }}
            >
              { c.name && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    padding: '0 4px',
                    borderRadius: '3px 3px 3px 0',
                    background: c.color,
                    color: 'var(--junipero-onyx)',
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: '14px',
                    whiteSpace: 'nowrap',
                    opacity: labels[c.id] ? 1 : 0,
                    transition: 'opacity .2s ease-in-out',
                  }}
                >
                  { c.name }
                </span>
              ) }
            </div>
          ) }
        </Fragment>
      )) }
    </div>
  );
};

FieldCursors.displayName = 'FieldCursors';

export default FieldCursors;
