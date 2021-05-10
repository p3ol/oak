import React, { useContext, useRef } from 'react';
import { execCommand } from '@poool/aspen';

import styles from './index.styl';

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
    execCommand(modifier, contentEditable.current);
    onChange_();
  };

  const onChange_ = () => {
    onChange?.({ value: contentEditable?.current?.innerHTML });
  }
;

  return (
    <div className={styles.aspen}>
      <div className={styles.header}>
        { modifiers.map((modifier, key) => (
          <button
            className={styles.button}
            key={key}
            onClick={e => changeStyle(e, modifier.property)}
          >
            <i className="material-icons">{modifier.icon}</i>
          </button>
        ))}
      </div>
      <div
        id="contentEditable"
        className={styles.editor}
        ref={contentEditable}
        onKeyUp={() => onChange_()}
        dangerouslySetInnerHTML={{ __html: value }}
        contentEditable
      />
    </div>
  );
};

export default TextEditor;
