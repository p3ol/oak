import { useSlate } from 'slate-react';
import { Tooltip } from '@poool/junipero';
import { classNames } from '@poool/junipero-utils';

import { toggleMark } from './editor';

export default ({
  increase = true,
  currentSize,
  icon,
  tooltipText,
  className,
}) => {
  const editor = useSlate();

  const onClick = e => {
    e.preventDefault();
    const updatedSize = increase
      ? parseInt(currentSize) + 1
      : parseInt(currentSize) - 1;
    toggleMark(editor, 'size', `${updatedSize}px`);
  };

  return (
    <Tooltip text={tooltipText}>
      <a
        href="#"
        onClick={onClick}
        className={classNames('oak-toolbar-button', className)}
      >
        <i className="oak-icons">{icon}</i>
      </a>
    </Tooltip>
  );
};
