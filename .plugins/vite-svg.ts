import fs from 'node:fs/promises';

export default function viteSvg () {
  return {
    name: 'svg',
    enforce: 'pre',
    async load (id: string) {

      if (/\.(svg)$/.test(id)) {
        const code = await fs.readFile(id, 'utf-8');
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
