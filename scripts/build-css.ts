/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss';

/**
 * Compiles a tailwind (v4) css entrypoint into a minified css file.
 * Usage: node --import=tsx scripts/build-css.ts <input> <output>
 */
const [input, output] = process.argv.slice(2).map(p => path.resolve(p));

if (!input || !output) {
  console.error('Usage: build-css.ts <input> <output>');
  process.exit(1);
}

(async () => {
  console.log('Compiling', path.basename(input), '->', path.basename(output));

  const source = await fs.readFile(input, 'utf-8');
  const { css, map } = await postcss([
    tailwindcss({ optimize: { minify: true } }),
    autoprefixer(),
  ]).process(source, {
    from: input,
    to: output,
    map: { inline: false },
  });

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(
    output,
    css + `\n/*# sourceMappingURL=${path.basename(output)}.map */`
  );

  if (map) {
    await fs.writeFile(output + '.map', map.toString());
  }
})();
