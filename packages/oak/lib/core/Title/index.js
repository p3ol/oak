import { SelectField, TextField, ColorPicker } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import EditBox from '../EditBox';
import TextEditor from '../TextEditor';
import TitleOptions from './TitleOptions';

import styles from '../Text/index.styl';

const Title = ({ element }) => {

  return (
    <span style={{
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }}
    >
      {React.createElement(element.headingLevel || 'h1', {
        className: styles.title,
        dangerouslySetInnerHTML: { __html: element.content },
      },
      )}
    </span>
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
