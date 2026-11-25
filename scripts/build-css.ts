/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss';

/**
 * Compiles css (tailwind v4) or sass stylesheets into minified css files,
 * with source maps.
 *
 * Usage:
 *   node --import=tsx ../../scripts/build-css.ts [options] <input> <output>
 *
 * Options:
 *   --sass             Compile the input with sass first
 *   --load-path <dir>  Additional sass load path (repeatable). The root
 *                      node_modules folder is always one.
 *
 * With `--sass`, the input can also be a directory: each of its sass files
 * (except `index` & partials) is compiled into `<output>/<name>.min.css`.
 */

const ROOT_NODE_MODULES = path.resolve(import.meta.dirname, '../node_modules');
const SASS_EXTENSIONS = ['.sass', '.scss'];

export interface Options {
  sass: boolean;
  loadPaths: string[];
}

const parseArgs = (args: string[]) => {
  const options: Options = { sass: false, loadPaths: [] };
  const paths: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--sass') {
      options.sass = true;
    } else if (args[i] === '--load-path') {
      options.loadPaths.push(path.resolve(args[++i]));
    } else {
      paths.push(path.resolve(args[i]));
    }
  }

  return { options, input: paths[0], output: paths[1] };
};

const compile = async (input: string, output: string, options: Options) => {
  console.log('Compiling', path.basename(input), '->', path.basename(output));

  let source: string;
  let prev: object | undefined;

  if (options.sass) {
    const result = await sass.compileAsync(input, {
      style: 'compressed',
      sourceMap: true,
      sourceMapIncludeSources: true,
      loadPaths: [...options.loadPaths, ROOT_NODE_MODULES],
    });

    source = result.css;

    if (result.sourceMap) {
      // Sources relative to the output instead of absolute file urls
      result.sourceMap.sources = result.sourceMap.sources.map(s =>
        s.startsWith('file:')
          ? path.relative(path.dirname(output), fileURLToPath(s))
          : s
      );
      prev = result.sourceMap;
    }
  } else {
    source = await fs.readFile(input, 'utf-8');
  }

  const { css, map } = await postcss([
    tailwindcss({ optimize: { minify: true } }),
    autoprefixer(),
  ]).process(source, {
    from: input,
    to: output,
    map: { inline: false, prev },
  });

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(
    output,
    css + `\n/*# sourceMappingURL=${path.basename(output)}.map */`
  );

  if (map) {
    await fs.writeFile(output + '.map', map.toString());
  }
};

const main = async () => {
  const { options, input, output } = parseArgs(process.argv.slice(2));

  if (!input || !output) {
    console.error(
      'Usage: build-css.ts [--sass] [--load-path <dir>] <input> <output>'
    );
    process.exit(1);
  }

  if ((await fs.stat(input)).isDirectory()) {
    if (!options.sass) {
      console.error('Directories can only be compiled with --sass');
      process.exit(1);
    }

    const files = (await fs.readdir(input, { withFileTypes: true }))
      .filter(f => f.isFile() && SASS_EXTENSIONS.includes(path.extname(f.name)))
      .map(f => f.name)
      .filter(name => !name.startsWith('_') && !/^index\./.test(name))
      .sort();

    for (const file of files) {
      await compile(
        path.join(input, file),
        path.join(output, `${path.parse(file).name}.min.css`),
        options,
      );
    }
  } else {
    await compile(input, output, options);
  }
};

main();
