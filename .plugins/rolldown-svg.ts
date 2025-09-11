export default function rolldownSvg () {
  return {
    name: 'svg',
    transform (code: string, id: string) {
      if (id.endsWith('.svg')) {
        const escaped = code
          .replace(/"/g, '\\"')
          .replace(/\r?\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          code: `export default "${escaped}";`,
          map: { mappings: '' },
        };
      }

      return null;
    },
  };
}
