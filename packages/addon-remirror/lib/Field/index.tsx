import type { Node } from '@remirror/pm/model';
import { type ComponentPropsWithoutRef, useCallback, useMemo } from 'react';
import { type FieldContent, classNames } from '@junipero/react';
import { type RemirrorEventListener, prosemirrorNodeToHtml } from 'remirror';
import { Remirror, EditorComponent, useRemirror } from '@remirror/react';

import type { Extensions, FieldOptions } from '../types';
import { type RemirrorFieldContextValue, RemirrorFieldContext } from './context';
import Menu from './Menu';

export interface RemirrorFieldProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string;
  extensions?(): Extensions[];
  /** Given by oak builders, used for translations */
  fieldOptions?: FieldOptions;
  onChange?(field: FieldContent<string>): void;
}

const RemirrorField = ({
  className,
  value,
  extensions,
  fieldOptions,
  onChange,
  ...rest
}: RemirrorFieldProps) => {
  const t = fieldOptions?.t;
  const container = fieldOptions?.floatingsRef?.current || undefined;
  const context = useMemo<RemirrorFieldContextValue>(() => ({
    t: (key, def) => t?.(key, def) ?? def,
    container,
  }), [t, container]);

  const { manager, setState, state } = useRemirror({
    extensions,
    content: value,
    stringHandler: 'html',
    selection: 'end',
  });

  const onChange_ = useCallback<
    RemirrorEventListener<Extensions>
  >(({ state }) => {
    setState(state);
    onChange?.({ value: prosemirrorNodeToHtml(state.doc as Node) });
  }, [setState, onChange]);

  return (
    <RemirrorFieldContext value={context}>
      <div className={classNames('remirror-field', className)} { ...rest }>
        <Remirror manager={manager} initialContent={state} onChange={onChange_}>
          <Menu />
          <EditorComponent />
        </Remirror>
      </div>
    </RemirrorFieldContext>
  );
};

RemirrorField.displayName = 'RemirrorField';

export default RemirrorField;
