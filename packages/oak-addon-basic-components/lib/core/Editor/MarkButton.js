import { useSlate } from 'slate-react';
import { classNames } from '@poool/junipero-utils';

import { isMarkActive, toggleMark } from './editor';

export default ({ format, icon, className }) => {
  const editor = useSlate();

  const onClick = e => {
    e.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <a
      href="#"
      onClick={onClick}
      className={classNames(
        'oak-toolbar-button',
        'oak-' + format,
        {
          'oak-active': isMarkActive(editor, format),
        },
        className,
      )}
    >
      <i className="oak-icons">{ icon }</i>
    </a>
  );
};
