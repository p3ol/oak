import Builder from '../Builder';
import Texts from './index';

describe('Texts', () => {
  it('should allow to manage multiple text sheets', () => {
    const texts = new Texts({ builder: new Builder() });

    texts.addSheet({ id: 'fr', texts: { foo: 'Ceci est un texte' } });
    texts.addSheet({ id: 'es', texts: { foo: 'Este es un texto' } });

    expect(texts.get('foo', 'This is a text')).toBe('This is a text');

    texts.setActiveSheet('fr');
    expect(texts.get('foo', 'This is a text')).toBe('Ceci est un texte');

    texts.setActiveSheet('es');
    expect(texts.get('foo', 'This is a text')).toBe('Este es un texto');

    expect(texts.removeSheet('es')).toBe(true);
    expect(texts.get('foo', 'This is a text')).toBe('Ceci est un texte');

    texts.setActiveSheet('fr');
    texts.set('foo', 'Ceci est un nouveau texte');
    expect(texts.get('foo', 'This is a text'))
      .toBe('Ceci est un nouveau texte');
  });
});
