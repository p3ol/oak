export const SIZES = {
  text: 16,
  headings: { h1: 32, h2: 24, h3: 19, h4: 16, h5: 13, h6: 10 },
};

export const getActiveAttrs = (editorState, type) => {
  const { from, to } = editorState.selection;
  let marks = [];

  editorState.doc.nodesBetween(from, to, node => {
    marks = [...marks, ...node.marks];
  });

  const mark = marks.find(markItem => markItem.type.name === type.name);

  return mark ? mark.attrs : {};
};
