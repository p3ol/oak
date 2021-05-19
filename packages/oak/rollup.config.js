import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';

const isForIE = process.env.BROWSERSLIST_ENV === 'ie';
const input = './lib/index.js';
const output = `./dist${isForIE ? '/ie' : ''}`;
const name = 'oak';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [];
const defaultGlobals = {};

const defaultPlugins = [
  alias({
    entries: {
      react: require.resolve('preact/compat'),
      'react-dom': require.resolve('preact/compat'),
    },
  }),
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs(),
  terser(),
];

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      ...defaultPlugins,
    ],
    external: defaultExternals,
    output: {
      ...(f === 'esm' ? {
        dir: `${output}/esm`,
        chunkFileNames: '[name].js',
      } : {
        file: `${output}/${name}.${f}.js`,
      }),
      format: f,
      name,
      sourcemap: true,
      globals: defaultGlobals,
    },
    ...(f === 'esm' ? {
      manualChunks: id => {
        if (/packages\/oak\/lib\/(\w+)\/index.js/.test(id)) {
          return path.parse(id).dir.split('/').pop();
        } else if (id.includes('node_modules')) {
          return 'vendor';
        } else {
          return path.parse(id).name;
        }
      },
    } : {}),
  })),
  {
    input: './lib/index.styl',
    plugins: [
      postcss({
        extensions: ['.styl'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        modules: true,
        plugins: [
          autoprefixer({ env: process.env.BROWSERSLIST_ENV }),
        ],
      }),
    ],
    output: {
      file: `${output}/${name}.min.css`,
    },
    onwarn: (warning, warn) => {
      if (warning.code === 'FILE_NAME_CONFLICT') {
        return;
      }

      warn(warning);
    },
  },
];
