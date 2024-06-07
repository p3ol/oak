import path from 'node:path';

import type { Plugin } from 'rollup';
import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const input = './lib/index.ts';
const output = './dist';
const name = 'oak-core';
const formats = ['umd', 'cjs', 'esm'];

const defaultPlugins: Plugin[] = [
  commonjs({ include: /node_modules/ }),
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.js', '.ts', '.json', '.node'],
  }),
  terser(),
];

const defaultExternals: string[] = [];
const defaultGlobals = {};

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      swc({
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      }),
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
      ...(f === 'esm' ? {
        manualChunks: (id: string) => {
          if (/packages\/core\/lib\/(\w+)\/index.ts/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else {
            return id.includes('node_modules') ? 'vendor' : path.parse(id).name;
          }
        },
      } : {}),
    },
  })),
];
