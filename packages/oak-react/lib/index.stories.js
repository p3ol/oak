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

  return (
    <>
      <Builder
        options={{ addons: [basicComponents] }}
        value={state.value}
        onChange={onChange}
      />
      <div>
        Raw value:
        <pre>{ JSON.stringify(state.value, null, 2) }</pre>
      </div>
    </>
  );
};
