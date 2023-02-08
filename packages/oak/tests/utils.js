import { get } from '@junipero/react';

import { AppContext } from '../lib/contexts';

export const withBuilder = (component, builder_) => {
  const getText = jest.fn().mockImplementation((key, def) => {
    if (typeof key !== 'string') return def;

    return get(builder_?.options?.texts, key, def);
  });

  const builder = { getText, getComponent: () => {}, oakRef: {}, ...builder_ };

  return (
    <AppContext.Provider value={builder}>
      { component }
    </AppContext.Provider>
  );
};
