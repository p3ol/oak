import Builder from './Builder';
import { baseAddon } from './addons';

export default { title: 'React/Builder' };

const baseContent = [
  { type: 'row', content: [] },
  { type: 'text', content: 'Test' },
];

export const basic = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
  />
);
