import { useReducer } from 'react';
import { mockState } from '@poool/junipero-utils';

import { Builder } from './';
import basicComponents from '../../oak-addon-basic-components/lib';

export default { title: 'oak-react' };

export const basicConfig = () => {
  const [state, dispatch] = useReducer(mockState, {
    value: [],
  });

  const onChange = ({ value }) => {
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
          setTimeout(() => resolve(fr.result), 2000);
        };
      }
    });
  };

  return (
    <Builder
      addons={[basicComponents]}
      value={state.value}
      onChange={onChange}
      onImageUpload={onImageUpload}
    />
  );
};
