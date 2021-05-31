import { useReducer } from 'react';
import { mockState } from '@poool/junipero-utils';
import { action } from '@storybook/addon-actions';

import { Builder } from './';
import basicComponents from '../../oak-addon-basic-components/lib';

export default { title: 'oak-react' };

const BuilderWrapper = ({ onChange }) => {
  const [state, dispatch] = useReducer(mockState, {
    value: [],
  });

  const onChange_ = ({ value }) => {
    onChange({ value });
    dispatch({ value });
  };

  // Simulate file upload
  const onImageUpload = e => {
    return new Promise(resolve => {
      const file = e.target.files[0];

      if (file) {
        const fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = () => {
          setTimeout(() => resolve({ url: fr.result, name: file.name }), 2000);
        };
      }
    });
  };

  return (
    <Builder
      addons={[basicComponents]}
      value={state.value}
      onChange={onChange_}
      onImageUpload={onImageUpload}
    />
  );
};

export const BasicConfig = () => {
  return (
    <BuilderWrapper
      onChange={action('change')}
    />
  );
};
