import { AppContext } from '../lib/contexts';

export const withBuilder = (component, builder) => (
  <AppContext.Provider value={builder}>
    { component }
  </AppContext.Provider>
);
