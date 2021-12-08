import Editor from './core/Editor';

export default {
  fieldTypes: [{
    type: 'prosemirror',
    default: [],
    render: (baseProps, customProps) => (
      <Editor { ...customProps } { ...baseProps } />
    ),
  }],
};
