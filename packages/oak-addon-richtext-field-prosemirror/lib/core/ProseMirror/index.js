import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { EditorView } from 'prosemirror-view';

export default forwardRef(({ state, onChange, ...rest }, ref) => {
  const rootRef = useRef();
  const viewRef = useRef();

  useImperativeHandle(ref, () => ({
    viewRef,
    rootRef,
    get view () {
      return viewRef.current;
    },
  }));

  useEffect(() => {
    const view = new EditorView(rootRef.current, {
      state,
      dispatchTransaction: transaction => {
        onChange?.(viewRef.current.state.apply(transaction));
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    viewRef.current?.updateState(state);
  }, [state]);

  return (
    <div ref={rootRef} { ...rest } />
  );
});
