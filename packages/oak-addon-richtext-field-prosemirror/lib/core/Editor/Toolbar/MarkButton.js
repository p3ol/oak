import { Tooltip, classNames } from '@poool/junipero';

export default ({
  tooltipText,
  onClick,
  format,
  className,
  icon,
  active = false,
}) => {
  const onClick_ = e => {
    e.preventDefault();
    onClick();
  };

  return (
    <Tooltip text={tooltipText}>
      <a
        href="#"
        onClick={onClick_}
        className={classNames(
          'oak-toolbar-button',
          'oak-' + format,
          {
            'oak-active': active,
          },
          className,
        )}
      >
        <i className="oak-icons">{ icon }</i>
      </a>
    </Tooltip>
  );
};
