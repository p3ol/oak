import { type ComponentPropsWithoutRef, useCallback } from 'react';
import { type FieldContent, classNames } from '@oakjs/react';
import { type RemirrorEventListener, prosemirrorNodeToHtml } from 'remirror';
import { Remirror, EditorComponent, useRemirror } from '@remirror/react';

import type { Extensions } from '../types';
import Menu from './Menu';

export interface RemirrorFieldProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string;
  extensions?(): Extensions[];
  onChange?(field: FieldContent<string>): void;
}

const RemirrorField = ({
  className,
  value,
  extensions,
  onChange,
  ...rest
}: RemirrorFieldProps) => {
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
    onChange({ value: prosemirrorNodeToHtml(state.doc) });
  }, [setState]);

  return (
    <div className={classNames('remirror-field', className)} { ...rest }>
      <Remirror manager={manager} initialContent={state} onChange={onChange_}>
        <Menu />
        <EditorComponent />
      </Remirror>
    </div>
  );
};

RemirrorField.displayName = 'RemirrorField';

export default RemirrorField;
