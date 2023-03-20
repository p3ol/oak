import Builder from './Builder';

export default { title: 'React/Builder' };

const baseContent = [
  { type: 'row', content: [] },
  { type: 'text', content: 'Test' },
];

export const basic = () => (
  <Builder value={baseContent} options={{ debug: true }} />
);
