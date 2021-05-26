import { useRef } from 'react';

import Icon from '../Icon';

const TextEditor = ({
  value,
  onChange = () => {},
}) => {
  const contentEditable = useRef(null);
  const modifiers = [
    { icon: 'format_bold', property: 'bold' },
    { icon: 'format_underline', property: 'underline' },
    { icon: 'format_italic', property: 'italic' },
  ];

  const changeStyle = (e, modifier) => {
    e.preventDefault();
    e.stopPropagation();
    // execCommand(modifier, contentEditable.current);
    onChange_();
  };

  const onChange_ = () => {
    onChange?.({ value: contentEditable?.current?.innerHTML });
  }
;

  return (
    <div className="oak-text-editor">
      <div className="oak-header">
        { modifiers.map((modifier, key) => (
          <button
            className="oak-button"
            key={key}
            onClick={e => changeStyle(e, modifier.property)}
          >
            <Icon name={modifier.icon} />
          </button>
        ))}
      </div>
      <div
        id="contentEditable"
        className="oak-text-content"
        ref={contentEditable}
        onKeyUp={() => onChange_()}
        dangerouslySetInnerHTML={{ __html: value }}
        contentEditable
      />
    </div>
  );
};

export default TextEditor;
