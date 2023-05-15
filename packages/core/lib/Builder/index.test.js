import { baseAddon } from '../addons';
import Builder from './index';

describe('Builder', () => {
  it('should create a builder', () => {
    const content = [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
    ];

    let id = 0;
    const builder = new Builder({
      addons: [baseAddon],
      content,
      options: {
        generateId: () => id++,
      },
    });

    expect(builder.getContent()).toMatchSnapshot('Base content');

    builder.removeElement(1);

    expect(builder.getContent()).toMatchSnapshot('Without text');

    const button = { type: 'button', content: 'This is a button' };
    builder.addElement(button);

    expect(builder.getContent()).toMatchSnapshot('With button');

    builder.setElement(2, { content: 'This is a new button' });

    expect(builder.getContent()).toMatchSnapshot('With button updated');

    builder.moveElement(button, content[0], { position: 'before' });

    expect(builder.getContent()).toMatchSnapshot('With button & title swapped');

    builder.duplicateElement(button);

    expect(builder.getContent()).toMatchSnapshot('With button duplicated');
  });

  it('should allow to listen to changes', () => {
    const builder = new Builder({
      addons: [baseAddon],
    });

    const listener = jest.fn();
    const unsubscribe = builder.subscribe(listener);

    builder.addElement({ type: 'title', content: 'This is a title' });

    expect(listener)
      .toHaveBeenCalledWith('content.update', expect.arrayContaining([
        expect.objectContaining({ type: 'title', content: 'This is a title' }),
      ]));

    unsubscribe();

    builder.addElement({ type: 'text', content: 'This is a text' });

    // 1 -> content.update
    // 2 -> history.commit
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should allow to add addons', () => {
    const builder = new Builder();

    builder.addAddon({
      components: [{
        id: 'richtext',
      }],
      fields: [{
        type: 'richtext-field',
      }],
    });

    expect(builder.getAvailableComponents()).toMatchSnapshot('Components');
    expect(builder.getAvailableFields()).toMatchSnapshot('Fields');
  });

  it('should allow to translate texts', () => {
    const builder = new Builder({
      addons: [{
        texts: [{
          id: 'fr',
          texts: {
            core: {
              pasteFromClipboard: 'Coller depuis le presse-papier',
            },
          },
        }],
      }],
    });

    expect(builder.getText('core.pasteFromClipboard', 'Paste from clipboard'))
      .toBe('Paste from clipboard');

    builder.setActiveTextSheet('fr');

    expect(builder.getText('core.pasteFromClipboard', 'Paste from clipboard'))
      .toBe('Coller depuis le presse-papier');
  });
});
