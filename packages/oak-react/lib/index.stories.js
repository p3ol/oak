import { useState } from 'react';

import { Builder } from './';

export default { title: 'oak' };

export const basicConfig = () => {
  const [value, setValue] = useState();

  return (
    <Builder value={value} onChange={({ value }) => setValue(value)} />
  );
};
