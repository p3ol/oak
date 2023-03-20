import { useRef } from 'react';

import Builder from './Builder';

export default { title: 'React/Builder' };

export const basic = () => {
  const builderRef = useRef();

  const setDefaultContent = () => {
    builderRef.current.builder.setContent([
      { type: 'row', content: [] },
      { type: 'text', content: 'Test' },
    ]);
  };

  return (
    <div>
      <div>
        <button onClick={setDefaultContent}>Add content</button>
      </div>
      <Builder ref={builderRef} />
    </div>
  );
};
