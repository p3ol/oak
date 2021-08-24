import { serialize as s, deserialize as d } from './core/Editor/html';
import Editor from './core/Editor';
import Node from './core/Editor/Node';

const serialize = elmt => ({ content: s(elmt.content) });

const deserialize = elmt => ({ content: d(elmt.content) });

export default {
  fieldTypes: [{
    type: 'richtext',
    default: [],
    serialize,
    deserialize,
    render: (baseProps, customProps) => (
      <Editor { ...customProps } { ...baseProps } />
    ),
  }],
};

export const renderContent = element => typeof element.content === 'string' ? (
  <div dangerouslySetInnerHTML={{ __html: element.content }} />
) : element.content.map((c, i) => (
  <Node { ...c } key={i} />
));

export { serialize, deserialize };

export { default as localeFr } from './languages/fr';
