import { render } from '@testing-library/react';
import Catalogue from '.';
import { withBuilder } from '../../../tests/utils';

describe('', () =>
  it('should be truthy', () => {
    const { debug } = render(withBuilder(<Catalogue />, {}));
    debug();
    expect(true).toBeTruthy();
  })
);
