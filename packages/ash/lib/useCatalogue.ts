import { useCallback, useMemo } from 'react';
import type {
  ComponentObject,
  ComponentOverride,
  ComponentsGroupObject,
} from '@oakjs/core';

import { useBuilder, useEditor } from './hooks';
import { commitDrop, getDefaultInsertTarget } from './dnd';
import { parseClipboardElements, pasteElements } from './clipboard';
import { readClipboard } from './utils';

/**
 * Components that can be inserted from the catalogue (insert panel &
 * toolbar), and helpers to insert them at the default location (after or
 * inside the selected element, or at the end of the page).
 */
export const useCatalogue = () => {
  const { builder, addons } = useBuilder();
  const { tree, selectedId, select } = useEditor();

  const groups = useMemo<ComponentsGroupObject[]>(() => (
    builder.getAvailableComponents()
      .filter(g => g.usable !== false && (
        builder.getOverride('component', g.id) as ComponentOverride
      )?.usable !== false)
      .map(g => ({
        ...g,
        components: g.components.filter((c: ComponentObject) => {
          const override = builder
            .getOverride('component', c.id) as ComponentOverride;

          return (override?.usable ?? c.usable) !== false;
        }),
      }))
      .filter(g => g.components.length > 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, addons]);

  const insert = useCallback((component: ComponentObject) => {
    const target = getDefaultInsertTarget(
      builder, tree, component.id, selectedId
    );
    const element = commitDrop(
      builder,
      tree,
      { type: 'component', componentId: component.id },
      target,
    );

    if (element?.id !== undefined) {
      select(String(element.id));
    }

    return element;
  }, [builder, tree, selectedId, select]);

  const paste = useCallback(async () => {
    const added = pasteElements(
      builder,
      tree,
      selectedId,
      parseClipboardElements(builder, await readClipboard()),
    );

    if (added?.[0]?.id !== undefined) {
      select(String(added[0].id));
    }
  }, [builder, tree, selectedId, select]);

  return { groups, insert, paste };
};
