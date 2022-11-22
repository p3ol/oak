import { renderHook } from '@testing-library/react';
import { useProseMirror } from './hooks';
import { schema } from './core/Editor/schema';
import { DOMParser as proseDOMParser } from 'prosemirror-model';

describe('useProsemirror', () => {
  it('should set the corect state', () => {
    const { result } = renderHook(
      () => useProseMirror({
        schema,
        doc: proseDOMParser.fromSchema(schema)
          .parse(new DOMParser().parseFromString(
            '<div>coucou</div>', 'text/html'
          )),
        docFormat: 'html' })
    );
    const doc = result.current[0].doc.toJSON();
    expect(doc.type).toEqual('doc');
    expect(doc.content.length).toEqual(1);

    const paragraph = doc.content[0];
    expect(paragraph.type).toEqual('paragraph');
    expect(paragraph.content.length).toEqual(1);

    const text = paragraph.content[0];
    expect(text.type).toEqual('text');
    expect(text.text).toEqual('coucou');
  });
  describe('with nodes', () => {
    it('should correctly handle multiple paragraphs', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<div>hola</div><div>coucou</div>', 'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();

      expect(doc.content.length).toEqual(2);
      const first = doc.content[0];
      const second = doc.content[1];

      expect(first.type).toEqual('paragraph');
      expect(first.content.length).toEqual(1);

      const firstText = first.content[0];
      expect(firstText.type).toEqual('text');
      expect(firstText.text).toEqual('hola');

      expect(second.type).toEqual('paragraph');
      expect(second.content.length).toEqual(1);

      const secondText = second.content[0];
      expect(secondText.type).toEqual('text');
      expect(secondText.text).toEqual('coucou');
    });

    it('should correctly parse p and div tags from content', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<p>hola</p><div>coucou</div>', 'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();
      expect(doc.content.length).toEqual(2);
      const first = doc.content[0];
      const second = doc.content[1];

      expect(first.type).toEqual('paragraph');
      expect(first.content.length).toEqual(1);

      const firstText = first.content[0];
      expect(firstText.type).toEqual('text');
      expect(firstText.text).toEqual('hola');

      expect(second.type).toEqual('paragraph');
      expect(second.content.length).toEqual(1);

      const secondText = second.content[0];
      expect(secondText.type).toEqual('text');
      expect(secondText.text).toEqual('coucou');
    });

    it('should correctly parse br and empty divs from content', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<div></div><div>coucou</div><br/>', 'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();
      expect(doc.content.length).toEqual(3);

      const firstHardBreak = doc.content[0];
      expect(firstHardBreak.type).toEqual('paragraph');
      expect(firstHardBreak.content.length).toEqual(1);
      expect(firstHardBreak.content[0]).toEqual(
        expect.objectContaining({ type: 'hard_break' })
      );

      const middleContent = doc.content[1];
      expect(middleContent.type).toEqual('paragraph');
      expect(middleContent.content[0].type).toEqual('text');
      expect(middleContent.content[0].text).toEqual('coucou');

      const secondHardBreak = doc.content[2];
      expect(secondHardBreak.type).toEqual('paragraph');
      expect(secondHardBreak.content.length).toEqual(1);
      expect(secondHardBreak.content[0]).toEqual(
        expect.objectContaining({ type: 'hard_break' })
      );
    });

    it('should handle paragraph attribute', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<div>left content</div>' +
              '<div style="text-align:center">centered content</div>' +
              '<div style="text-align:right">right content</div>', 'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();

      expect(doc.content.length).toEqual(3);
      expect(doc.content[0].attrs).toEqual(
        expect.objectContaining({ alignment: 'left' })
      );
      expect(doc.content[0].content[0].text).toEqual('left content');

      expect(doc.content[1].attrs).toEqual(
        expect.objectContaining({ alignment: 'center' })
      );
      expect(doc.content[1].content[0].text).toEqual('centered content');

      expect(doc.content[2].attrs).toEqual(
        expect.objectContaining({ alignment: 'right' })
      );
      expect(doc.content[2].content[0].text).toEqual('right content');
    });
  });

  describe('with marks', () => {
    it('should correctly set styles', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<span style="color:#FF0000">' +
                'red<span style="font-weight:bold">red and bold</span>' +
              '</span>' +
              '<span style="font-size: 2px">very small</span>',
              'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();

      const paragraph = doc.content[0];
      expect(paragraph.content.length).toEqual(3);

      const red = paragraph.content[0];
      expect(red.type).toEqual('text');
      expect(red.text).toEqual('red');
      expect(red.marks.length).toEqual(1);
      expect(red.marks[0]).toEqual(
        expect.objectContaining({ type: 'color', attrs: { color: '#FF0000' } })
      );

      const redAndBold = paragraph.content[1];
      expect(redAndBold.type).toEqual('text');
      expect(redAndBold.text).toEqual('red and bold');
      expect(redAndBold.marks.length).toEqual(2);
      expect(redAndBold.marks[0]).toEqual(
        expect.objectContaining({ type: 'strong' })
      );
      expect(redAndBold.marks[1]).toEqual(
        expect.objectContaining({ type: 'color', attrs: { color: '#FF0000' } })
      );

      const small = paragraph.content[2];
      expect(small.type).toEqual('text');
      expect(small.text).toEqual('very small');
      expect(small.marks.length).toEqual(1);

      expect(small.marks[0]).toEqual(
        expect.objectContaining({ type: 'size', attrs: { size: '2px' } })
      );
    });
    it('should correctly handle multiple styled content', () => {
      const marks = [
        expect.objectContaining({
          type: 'size',
          attrs: {
            size: '2px',
          },
        }),
        expect.objectContaining({
          type: 'em',
        }),
        expect.objectContaining({
          type: 'strong',
        }),
        expect.objectContaining({
          type: 'color',
          attrs: {
            color: '#FFFFFF',
          },
        }),
        expect.objectContaining({
          type: 'underline',
        }),
      ];
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<span ' +
                'style="font-size: 2px; ' +
                'color:#FFFFFF; ' +
                'font-weight: bold; ' +
                'text-decoration: underline; ' +
                'font-style: italic">' +
                  'content' +
                '</span>',
              'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();

      const paragraph = doc.content[0];
      const text = paragraph.content[0];

      expect(text.marks.length).toEqual(5);
      expect(text.marks).toEqual(expect.arrayContaining(marks));
    });

    it('should correctly handle link mark', () => {
      const { result } = renderHook(
        () => useProseMirror({
          schema,
          doc: proseDOMParser.fromSchema(schema)
            .parse(new DOMParser().parseFromString(
              '<a href="http://google.com">' +
                'click <span style="color:#ffffff">me</span>' +
              '</a>',
              'text/html'
            )),
          docFormat: 'html' })
      );
      const doc = result.current[0].doc.toJSON();
      const paragraph = doc.content[0];
      expect(paragraph.content.length).toEqual(2);
      const firstText = paragraph.content[0];
      const secondText = paragraph.content[1];

      expect(firstText.marks[0]).toEqual(
        expect.objectContaining({
          type: 'link',
          attrs: {
            href: 'http://google.com',
            target: null,
          },
        })
      );
      expect(secondText.marks).toEqual(expect.arrayContaining([
        expect.objectContaining({
          type: 'link',
          attrs: {
            href: 'http://google.com',
            target: null,
          },
        }),
        expect.objectContaining({
          type: 'color',
          attrs: {
            color: '#ffffff',
          },
        }),
      ]));
    });
  });

});
