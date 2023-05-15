import Overrides from './index';

describe('Overrides', () => {
  it('should allow to add overrides', () => {
    const overrides = new Overrides();
    overrides.add({ type: 'component', targets: ['foo'], fields: [{}] });
    overrides.add({ type: 'field' });
    expect(overrides.all()).toMatchSnapshot();
  });

  it('should allow to get an override', () => {
    const overrides = new Overrides();
    overrides.add({ type: 'component', targets: ['foo'], fields: [{}] });
    expect(overrides.get('component', 'foo')).toMatchSnapshot();
  });
});
