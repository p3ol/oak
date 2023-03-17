import { Tooltip, classNames } from '@junipero/react';

export default ({
  increasing = false,
  icon,
  tooltipText,
  className,
  onClick,
  currentSize,
}) => {
  const changeSize = e => {
    e.preventDefault();
    const newSize = increasing ? currentSize + 1 : currentSize - 1;
    onClick({ size: `${newSize}px` });
  };

  return (
    <Tooltip text={tooltipText}>
      <a
        href="#"
        onClick={changeSize}
        className={classNames(
          'oak-toolbar-button',
          'oak-size-button',
          className,
        )}
      >
        <i className="oak-icons">{icon}</i>
      </a>
    </Tooltip>
  );
};
