import { useProseMirror, ProseMirror } from 'use-prosemirror';
import { DOMParser } from 'prosemirror-model';

import { schema } from './core/Editor/schema';
import MenuBar from './core/Editor/menuBar';

export default {
  fieldTypes: [{
    type: 'prosemirror',
    default: [],
    render: (baseProps, customProps) => {
      const test = document.createElement('div');
      test.innerHTML = baseProps.value;
      const [state, setState] = useProseMirror({
        schema,
        doc: DOMParser.fromSchema(schema).parse(test),
        docFormat: 'html',
      });

      return (
        <>
          <MenuBar state={state} setState={setState} />
          <ProseMirror state={state} onChange={setState} />
        </>
      );
    },
  }],
};
