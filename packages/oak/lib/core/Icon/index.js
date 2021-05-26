
export default ({ name, className }) => {

  return (
    <span
      style={{ fontFamily: 'oak-ico' }}
      className={className}
    >
      { name }
    </span>
  );
};
