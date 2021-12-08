export const SIZES = {
  text: 16,
  headings: { h1: 32, h2: 24, h3: 19, h4: 16, h5: 13, h6: 10 },
};

export const getActiveAttrs = (editorState, type) => {
  const { from, to } = editorState.selection;
  let marks = [];

  editorState.doc.nodesBetween(from, to, node => {
    marks = marks.concat(node.marks);
  });

  return marks
    .find(markItem => markItem.type.name === type.name)?.attrs || {};
};

export const isMarkActive = (state, type) => {
  const { from, $from, to, empty } = state.selection;

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type);
};

export const getAlignment = (state, alignment) => {
  const { $from } = state.selection;

  return $from.node(1)?.attrs?.alignment === alignment;
};
