import { Tab, Tabs } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import EditBox from '../EditBox';
import TextOptions from './TextOptions';

const Text = ({ element }) => {

  return (
    React.createElement('p', { style: {
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }, dangerouslySetInnerHTML: { __html: element.content } })
  );
};

Text.options = [{
  render: ({ element }) => {
    return (
      <EditBox title="Text options">
        <TextOptions element={element} />
      </EditBox>
    );
  },
}];
export default Text;
