import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { classNames } from '@poool/junipero-utils';

export default ({ format, icon }) => {
  const editor = useSlate();

  const onClick = e => {
    e.preventDefault();

    if (isActive()) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isActive = () =>
    Editor.marks(editor)?.[format] === true;

  return (
    <a
      href="#"
      onClick={onClick}
      className={classNames(
        'oak-toolbar-button',
        {
          'oak-active': isActive(),
        },
      )}
    >
      <i className="oak-icons">{ icon }</i>
    </a>
  );
};
