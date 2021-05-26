import { useState } from 'react';

import { Builder } from './';

export default { title: 'oak-react' };

export const basicConfig = () => {
  const [value, setValue] = useState();

  return (
    <Builder value={value} onChange={({ value }) => setValue(value)} />
  );
};
