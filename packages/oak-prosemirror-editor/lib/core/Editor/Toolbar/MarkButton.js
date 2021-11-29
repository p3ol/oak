import { Tooltip, classNames } from '@poool/junipero';

export default ({
  tooltipText,
  onClick,
  format,
  className,
  icon,
  active = false,
}) => {
  return (
    <Tooltip text={tooltipText}>
      <a
        href="#"
        onClick={onClick}
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
