import { useCallback, useEffect, useReducer, useRef } from 'react';
import type {
  Builder,
  ComponentObject,
  ComponentOverride,
  ElementObject,
  FieldContent,
  FieldObject,
  FieldOverride,
  FieldOverrideObject,
  SettingOverrideObject,
} from '@oakjs/core';
import { cloneDeep, get, set } from '@junipero/react';

import { getElementContainers } from '../tree';
import { useEditor } from '../hooks';

declare interface Serializer {
  key: string;
  method: (value: any) => any;
}

const getSerializers = (
  builder: Builder,
  element: ElementObject,
  type: 'serialize' | 'deserialize',
): Serializer[] => {
  const serialized: string[] = [];
  const serializers: Serializer[] = [];
  const overrides = (builder.getAllOverrides(
    'setting', element.type
  ) as SettingOverrideObject[]).filter(o => !!o[type]);

  overrides.forEach(override_ => {
    [].concat(override_.key).forEach((key: string) => {
      if (!get(element, key) && serialized.includes(key)) {
        return;
      }

      const override = builder.getOverride(
        'setting', element.type, { setting: override_ }
      ) as SettingOverrideObject;

      serialized.push(key);
      serializers.push({ key, method: override?.[type] });
    });
  });

  return serializers;
};

const applySerializers = (
  builder: Builder,
  element: ElementObject,
  type: 'serialize' | 'deserialize',
) => {
  getSerializers(builder, element, type).forEach(({ key, method }) => {
    if (typeof method === 'function') {
      set(element, key, method(get(element, key)));
    }
  });

  return element;
};

const COMMIT_DELAY = 300;

/**
 * Keeps an editable copy (draft) of an element, and commits changes made to
 * it back to the builder after a short delay, so that typing in a field
 * doesn't create a history entry for every keystroke.
 */
export const useElementDraft = (
  builder: Builder,
  element: ElementObject | null,
  component: ComponentObject | null,
) => {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const draft = useRef<ElementObject | null>(null);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = useRef<ElementObject | null>(null);

  const deserialize = useCallback((elmt: ElementObject) => {
    const override = builder
      .getOverride('component', elmt.type) as ComponentOverride;
    const deserializer = override?.deserialize || component?.deserialize ||
      ((e: ElementObject) => e);

    return applySerializers(
      builder, deserializer(cloneDeep(elmt)), 'deserialize'
    );
  }, [builder, component]);

  const commit = useCallback(() => {
    // Nothing changed since the draft was created
    if (!pending.current) {
      return;
    }

    clearTimeout(pending.current);
    pending.current = null;

    if (!draft.current || !target.current) {
      return;
    }

    const serialized = applySerializers(
      builder, cloneDeep(draft.current), 'serialize'
    );

    // Children may have been added/moved since the draft was created: never
    // overwrite the element's containers with the draft's (stale) copies
    const containers = getElementContainers(builder, target.current);
    Object.keys(serialized).forEach(key => {
      if (containers.includes(target.current[key])) {
        delete serialized[key];
      }
    });

    builder.setElement(target.current.id, serialized, {
      element: target.current,
    });
  }, [builder]);

  // Commit pending changes before switching to another element
  useEffect(() => () => commit(), [element?.id, commit]);

  // ...and before saving
  const registerPendingChanges = useEditor()?.registerPendingChanges;

  useEffect(() => registerPendingChanges?.(commit), [
    registerPendingChanges, commit,
  ]);

  // (Re)create the draft when the element changes from the outside (undo,
  // redo, other element selected...), unless we have pending changes
  useEffect(() => {
    if (pending.current && target.current?.id === element?.id) {
      target.current = element;

      return;
    }

    target.current = element;
    draft.current = element ? deserialize(element) : null;
    forceUpdate();
  // Element objects are mutated in place
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, deserialize, JSON.stringify(element)]);

  const schedule = useCallback(() => {
    forceUpdate();

    if (pending.current) {
      clearTimeout(pending.current);
    }

    pending.current = setTimeout(commit, COMMIT_DELAY);
  }, [commit]);

  const onSettingChange = useCallback((name: string, field: FieldContent) => {
    if (!draft.current) {
      return;
    }

    builder.setElementSettings(
      draft.current, name, field?.checked ?? field?.value
    );
    schedule();
  }, [builder, schedule]);

  const onSettingCustomChange = useCallback((
    name: string,
    renderer: FieldOverride | FieldObject | FieldOverrideObject,
    field: FieldContent,
  ) => {
    if (!draft.current) {
      return;
    }

    const changes = (renderer as any).onChange(name, field, draft.current);
    Object.assign(draft.current, changes);
    schedule();
  }, [schedule]);

  const onUpdate = useCallback((elmt: ElementObject) => {
    draft.current = elmt;
    schedule();
  }, [schedule]);

  return {
    draft: draft.current,
    onSettingChange,
    onSettingCustomChange,
    onUpdate,
    commit,
  };
};
