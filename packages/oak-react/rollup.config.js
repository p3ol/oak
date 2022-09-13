import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const input = './lib/index.js';
const output = './dist';
const name = 'oak-react';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['@poool/oak', 'react', 'react-dom', 'react-popper'];
const defaultGlobals = {
  '@poool/oak': 'oak',
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-popper': 'ReactPopper',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs(),
  terser(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
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
      ...(f === 'umd' && {
        name: 'OakReact',
        intro: `var global = typeof global !== "undefined" ? global :
          typeof self !== "undefined" ? self :
          typeof window !== "undefined" ? window : {}`,
      }),
      format: f,
      name,
      sourcemap: true,
      globals: defaultGlobals,
    },
    ...(f === 'esm' ? {
      manualChunks: id => {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    } : {}),
  })),
];
