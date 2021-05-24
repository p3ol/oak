import { SelectField, TextField, ColorPicker } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import TextEditor from '../TextEditor';

const Title = ({ element, className }) => {
  const Tag = element.headingLevel || 'h1';

  return (
    <div
      className={className}
      style={{
        color: element.style?.color,
        textAlign: element.style?.textAlign,
        width: element.style?.width,
      }}
    >
      <Tag
        className="oak-title"
        dangerouslySetInnerHTML={{ __html: element.content }}
      />
    </div>
  );
};

Title.options = [];

export default Title;
