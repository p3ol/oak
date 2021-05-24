import { SelectField, TextField, ColorPicker } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import EditBox from '../EditBox';
import TextEditor from '../TextEditor';
import TitleOptions from './TitleOptions';

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

Title.options = [{
  render: ({ element }) => {
    return (
      <EditBox title="Title options">
        <TitleOptions element={element} />

      </EditBox>
    );
  },
}];
export default Title;
