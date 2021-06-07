import { Transforms, Element, Editor } from 'slate';

import { deserializeNode } from './html';

export const withHtml = editor => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return ['style', 'script', 'image'].includes(element.type) ||
      isVoid(element);
  };

  editor.insertData = data => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserializeNode(parsed.body);
      Transforms.insertFragment(editor, fragment);

      return;
    }

    insertData(data);
  };

  return editor;
};

export const isMarkActive = (editor, format) =>
  Editor.marks(editor)?.[format] === true;

export const toggleMark = (editor, format) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) &&
      n.type === format,
  });

  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const newProperty = { type: isActive ? 'paragraph' : format };
  Transforms.setNodes(editor, newProperty);
};
