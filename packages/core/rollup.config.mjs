import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak-core';
const libName = 'OakCore';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [];
const defaultGlobals = {};

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
];

const getConfig = (format, {
  output = defaultOutput,
  globals = defaultGlobals,
  external = defaultExternals,
} = {}) => ({
  input,
  plugins: [
    ...defaultPlugins,
  ],
  external,
  output: {
    ...(format === 'esm' ? {
      dir: `${output}/esm`,
      chunkFileNames: '[name].js',
    } : {
      file: `${output}/${name}.${format}.js`,
    }),
    format,
    name: libName,
    sourcemap: true,
    globals,
    ...(format === 'esm' ? {
      manualChunks: id => {
        if (/packages\/core\/lib\/(\w+)\/index.js/.test(id)) {
          return path.parse(id).dir.split('/').pop();
        } else {
          return id.includes('node_modules') ? 'vendor' : path.parse(id).name;
        }
      },
    } : {}),
  },
});

export default [
  ...formats.map(f => getConfig(f)),
  {
    input: './lib/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    plugins: [dts()],
  },
];
