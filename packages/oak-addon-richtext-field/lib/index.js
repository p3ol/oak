import { serialize as s, deserialize as d } from './core/Editor/html';
import Editor from './core/Editor';
import Node from './core/Editor/Node';

export default {
  fieldTypes: [{
    type: 'richtext',
    render: (baseProps, customProps) => (
      <Editor { ...customProps } { ...baseProps } />
    ),
  }],
};

export const serialize = elmt => ({ content: s(elmt.content) });

export const deserialize = elmt => ({ content: d(elmt.content) });

export const renderContent = element => typeof element.content === 'string' ? (
  <Node text={element.content} />
) : element.content.map((c, i) => (
  <Node { ...c } key={i} />
));
