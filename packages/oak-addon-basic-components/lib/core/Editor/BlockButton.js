import { useSlate } from 'slate-react';
import { Tooltip, classNames } from '@poool/junipero';

import { isBlockActive, toggleBlock } from './editor';

export default ({ format, icon, className, tooltipText }) => {
  const editor = useSlate();

  const onClick = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <Tooltip text={tooltipText}>
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
    </Tooltip>
  );
};
