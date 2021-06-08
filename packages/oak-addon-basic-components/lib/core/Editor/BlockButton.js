import { useSlate } from 'slate-react';
import { classNames } from '@poool/junipero-utils';

import { isBlockActive, toggleBlock } from './editor';

export default ({ format, icon, className }) => {
  const editor = useSlate();

  const onClick = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <a
      href="#"
      onClick={onClick}
      className={classNames(
        'oak-toolbar-button',
        'oak-' + format,
        {
          'oak-active': isBlockActive(editor, format),
        },
        className,
      )}
    >
      <i className="oak-icons">{ icon }</i>
    </a>
  );
};
