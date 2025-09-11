/* eslint-disable no-console */
import path from 'node:path';

import fse from 'fs-extra';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

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
  });

  const { css: prefixedCss } = await postcss([
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
  await compile({
    input: path.resolve('./lib/index.sass'),
    output: path.resolve('./dist/oak-addon-ckeditor.min.css'),
  });
})();
