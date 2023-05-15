import { classNames } from '@oakjs/react';
import { prosemirrorNodeToHtml } from 'remirror';
import { Remirror, EditorComponent, useRemirror } from '@remirror/react';
import { useCallback } from 'react';

import Menu from './Menu';

const RemirrorField = ({ className, value, extensions, onChange }) => {
  const { manager, setState, state } = useRemirror({
    extensions,
    content: value,
    stringHandler: 'html',
    selection: 'end',
  });

  const onChange_ = useCallback(({ state }) => {
    setState(state);
    onChange({ value: prosemirrorNodeToHtml(state.doc) });
  }, [setState]);

  return (
    <div className={classNames('remirror-field', className)}>
      <Remirror manager={manager} initialContent={state} onChange={onChange_}>
        <Menu />
        <EditorComponent />
      </Remirror>
    </div>
  );
};

RemirrorField.displayName = 'RemirrorField';

export default RemirrorField;
