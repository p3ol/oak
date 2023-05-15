export const addStyles = (styles, { id } = {}) => {
  if (id && document.querySelector(`style#${id}`)) return;

  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = styles;
  document.head.appendChild(style);
};
