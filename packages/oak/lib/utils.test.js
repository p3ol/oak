import { sanitizeHTML, filterOverride } from './utils';

describe('Utils', () => {
  describe('sanitizeHTML', () => {
    it('should return sanitized HTML', () => {
      const content = '<p>hello <b>world</b></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).toEqual(content);
    });

    it('should remove style tags', () => {
      const content = '<p>hello<style>body { color: red; }</style></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).toEqual('<p>hello</p>');
    });

    it('should remove scripts tags', () => {
      const content = '<p>hello<script>alert("hello")</script></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).toEqual('<p>hello</p>');
    });

    it('should remove href to every a element', () => {
      const content = '<p>hello<a href="https://google.com">google</a></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).not.toContain('href="https://google.com');
    });

    it('should remove target to every "a" element', () => {
      const content =
        '<p>hello<a href="https://google.com target="_blank">google</a></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).not.toContain('target="_blank"');
    });

    it('should add role to "a" element', () => {
      const content = '<p>hello<a href="https://google.com">google</a></p>';
      const sanitized = sanitizeHTML(content);
      expect(sanitized).toContain('role="link"');
    });

    it('should correctly sanitize complex HTML', () => {
      const content = '<style>body { color: red; }</style>' +
      '<p>hello <b>world</b></p><p>hello <b>world</b>' +
      '<a href="https://google.com">google</a>' +
      '<a target="_blank" href="https://google.com">google</a></p>' +
      '<script>alert("hello")</script>';

      const sanitized = sanitizeHTML(content);
      expect(sanitized).toEqual(
        '<p>hello <b>world</b></p><p>hello <b>world</b>' +
        '<a role="link">google</a>' +
        '<a role="link">google</a></p>'
      );
    });
  });

  describe('filterOverride', () => {
    it('should return true if component item exists', () => {
      const override = {
        components: ['row'],
        fields: [],
      };

      const result = filterOverride('component', override, 'row');
      expect(result).toBeTruthy();
    });

    it('should return true if field item exists', () => {
      const override = {
        components: [],
        fields: ['item'],
      };

      const result = filterOverride('field', override, 'item');
      expect(result).toBeTruthy();
    });

    it('should return false if component item does not exist', () => {
      const override = {
        components: ['row2'],
        fields: [],
      };

      const result = filterOverride('component', override, 'row');
      expect(result).toBeFalsy();
    });

    it('should return false if field item does not exists', () => {
      const override = {
        components: [],
        fields: ['item2'],
      };

      const result = filterOverride('field', override, 'item');
      expect(result).toBeFalsy();
    });

    it('should return false if we search in unavailable type', () => {
      const override = {
        components: ['item'],
        fields: ['item'],
      };

      const result = filterOverride('unavailable', override, 'item');
      expect(result).toBeFalsy();
    });
  });
});
