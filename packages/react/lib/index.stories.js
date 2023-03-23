import Builder from './Builder';
import { baseAddon } from './addons';

export default { title: 'React/Builder' };

const baseContent = [
  { type: 'row', cols: [
    { content: [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
      { type: 'empty-space', settings: { height: '20px' } },
      { type: 'button', content: 'Click me' },
    ] },
  ] },
  { type: 'image', url: 'https://avatars.githubusercontent.com/u/20414672' },
];

export const basic = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
  />
);
