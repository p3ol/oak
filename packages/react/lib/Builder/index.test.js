import { render } from '@testing-library/react';

import { baseAddon } from '../addons';
import Builder from './index';

describe('<Builder />', () => {
  const getOptions = (...props) => {
    let i = 0;

    return {
      generateId: () => i++,
      ...props,
    };
  };

  it('should render', () => {
    const content = [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
    ];

    const { container, unmount } = render(
      <Builder
        value={content}
        addons={[baseAddon()]}
        options={getOptions()}
      />
    );

    expect(container).toMatchSnapshot('Base content');
    unmount();
  });
});
