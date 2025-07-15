import { ComponentOverride } from '../classes';
import { baseAddon, titleComponent } from '../addons';
import Builder from '../Builder';
import Store from './index';

describe('Store', () => {
  const getBuilder = (opts?: ConstructorParameters<typeof Builder>[0]) => {
    let id = 0;

    return new Builder({
      ...opts,
      options: {
        ...opts?.options,
        generateId: () => id++,
      },
    });
  };

  it('should allow to manage a set of elements', () => {
    const content = [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
    ];

    const store = new Store({ builder: getBuilder() });
    store.set(content);

    expect(store.get()).toMatchSnapshot('Base content');

    store.removeElement(1);

    expect(store.get()).toMatchSnapshot('Without text');

    const button = { type: 'button', content: 'This is a button' };
    store.addElement(button);

    expect(store.get()).toMatchSnapshot('With button');

    store.setElement(2, { content: 'This is a new button' });

    expect(store.get()).toMatchSnapshot('With button updated');

    store.moveElement(button, content[0], { position: 'before' });

    expect(store.get()).toMatchSnapshot('With button & title swapped');

    store.duplicateElement(button);

    expect(store.get()).toMatchSnapshot('With button duplicated');
  });

  describe('.sanitize()', () => {
    it('should allow to sanitize an element', () => {
      const store = new Store({ builder: getBuilder() });
      expect(store.sanitize({ type: 'title', content: 'This is a title' }))
        .toMatchSnapshot('Add id');

      expect(store.sanitize(
        { type: 'title' },
        { withDefaults: true, component: titleComponent() }
      )).toMatchSnapshot('Add id & default props from component');

      expect(store.sanitize(
        { type: 'title', content: 'This is a title' },
        {
          withDefaults: true,
          component: titleComponent({
            sanitize: element => ({
              ...element,
              content: element.content.toString() + ', a not so great one',
            }),
          }),
          override: new ComponentOverride({
            sanitize: element => ({
              ...element,
              content: element.content.toString() + ', a really great one',
            }),
          }),
        }
      )).toMatchSnapshot(
        'Allow custom sanitize on component or override level'
      );
    });

    it('should allow to sanitize elements with custom containers', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });

      expect(store.sanitize(
        { type: 'row', cols: [
          { type: 'col', content: [
            { type: 'title' },
          ] },
        ] },
        { withDefaults: true }
      )).toMatchSnapshot('Deeply sanitize');
    });
  });

  describe('.createElement()', () => {
    it('should allow to create an element', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });

      expect(store.createElement('title')).toMatchSnapshot('Title');
      expect(store.createElement('title', {
        override: new ComponentOverride({
          construct: () => ({ content: 'This is a great title' }),
        }),
      })).toMatchSnapshot('Title with custom construct');
    });
  });

  describe('.getElement()', () => {
    it('should allow to get an element', () => {
      const store = new Store({ builder: getBuilder() });
      store.set([{ type: 'title', content: 'This is a title' }]);

      expect(store.getElement(0)).toMatchSnapshot('Shallow element');
    });

    it('should allow to get an element with custom containers', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });
      store.set([{ type: 'row', cols: [
        { type: 'col', content: [
          { id: 'my-title', type: 'title', content: 'This is another title' },
        ] },
      ] }]);

      expect(store.getElement('my-title', { deep: true }))
        .toMatchSnapshot('Deep element');
    });
  });

  describe('.findNearestParent()', () => {
    it('should allow to find the nearest parent of an element', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });
      store.set([{ id: 'my-row', type: 'row', cols: [
        { id: 'my-col', type: 'col', content: [
          { id: 'my-title', type: 'title', content: 'This is another title' },
        ] },
      ] }]);

      expect(store.findNearestParent('my-row')).toMatchSnapshot('content');
      expect(store.findNearestParent('my-col')).toMatchSnapshot('row.cols');
      expect(store.findNearestParent('my-title'))
        .toMatchSnapshot('col.content');
    });
  });

  describe('.contains()', () => {
    it('should allow to check if an element is contained in the store', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });
      store.set([{ id: 'my-row', type: 'row', cols: [
        { id: 'my-col', type: 'col', content: [
          { id: 'my-title', type: 'title', content: 'This is another title' },
        ] },
      ] }]);

      expect(store.contains('my-row')).toBe(true);
      expect(store.contains('my-col')).toBe(true);
      expect(store.contains('my-title')).toBe(true);
      expect(store.contains('my-button')).toBe(false);
    });
  });

  describe('.getElementSettings()', () => {
    it('should allow to get the settings of an element', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });
      const element = {
        type: 'image',
        url: 'https://example.com/image.jpg',
        name: 'My image',
        settings: {
          width: 100,
          height: 100,
          rotate: 0,
        },
      };

      expect(store.getElementSettings(element, 'url')).toBe(element.url);
      expect(store.getElementSettings(element, 'settings.width')).toBe(100);
      expect(store.getElementSettings(element, 'settings.rotate')).toBe(0);
      expect(store
        .getElementSettings(element, [{ from: 'settings.width', to: 'width' }])
      ).toMatchObject({ width: 100 });
    });
  });

  describe('.setElementSettings()', () => {
    it('should allow to set the settings of an element', () => {
      const store = new Store({ builder: getBuilder({
        addons: [baseAddon()],
      }) });
      const element = {
        type: 'image',
        url: 'https://example.com/image.jpg',
        name: 'My image',
        settings: {
          width: 100,
          height: 100,
          rotate: 0,
        },
      };

      store
        .setElementSettings(element, 'url', 'https://example.com/image2.jpg');
      expect(element.url).toBe('https://example.com/image2.jpg');

      store.setElementSettings(element, 'settings.width', 200);
      expect(element.settings.width).toBe(200);

      store.setElementSettings(element, 'settings.rotate', 90);
      expect(element.settings.rotate).toBe(90);

      store.setElementSettings(element, [
        'url',
        { from: 'width', to: 'settings.width' },
      ], { url: 'https://example.com/image3.jpg', width: 300 });
      expect(element.url).toBe('https://example.com/image3.jpg');
      expect(element.settings.width).toBe(300);
    });
  });
});
