/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import fse from 'fs-extra';
import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export interface CompileOptions {
  input: string;
  output: string;
}

const compile = async ({ input, output }: CompileOptions) => {
  console.log('Compiling',
    `${input.split('/').pop()} -> ${output.split('/').pop()}`);

  const { css, sourceMap } = await sass.compileAsync(input, {
    style: 'compressed',
    sourceMap: true,
    sourceMapIncludeSources: true,
    loadPaths: [
      path.resolve('./lib/utils'),
      path.resolve('../../node_modules'),
    ],
  });

  const { css: prefixedCss } = await postcss([
    tailwindcss({
      config: path.resolve(__dirname, '../tailwind.config.ts'),
    }),
    autoprefixer(),
  ]).process(css, {
    from: input,
    to: output,
    map: {
      prev: sourceMap,
      inline: false,
    },
  });

  await fse.outputFile(
    output,
    prefixedCss + `\n/*# sourceMappingURL=${output.split('/').pop()}.map */`,
  );

  if (sourceMap) {
    sourceMap.sources = sourceMap.sources
      .map(s => s.replace(/file:\/{3}(?:.+)\/(.+)\.sass/, '$1.sass'));

    await fse.outputFile(
      output + '.map',
      JSON.stringify(sourceMap) || '',
    );
  }
};

(async () => {
  const components = fs
    .readdirSync(path.resolve('./lib'), { withFileTypes: true })
    .filter(f =>
      !f.isDirectory() &&
      !/index/.test(f.name) &&
      fs.existsSync(path.resolve('./lib', f.name))
    )
    .map(f => f.name.replace('.sass', ''));

  for (const component of components) {
    await compile({
      input: path.resolve('./lib', `${component}.sass`),
      output: path.resolve('./dist/css', `${component}.min.css`),
    });
  }

  // index
  await compile({
    input: path.resolve('./lib/index.sass'),
    output: path.resolve('./dist/oak.min.css'),
  });
})();
