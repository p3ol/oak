import path from 'path';
import fs from 'node:fs';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const input = './lib/index.ts';
const output = './dist';
const name = 'oak-core';
const formats = ['umd', 'cjs', 'esm'];

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.js', '.ts', '.json', '.node'],
  }),
  terser(),
];

const defaultExternals = [];
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
              jsx: true,
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
        manualChunks: id => {
          if (/packages\/core\/lib\/(\w+)\/index.ts/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else {
            return id.includes('node_modules') ? 'vendor' : path.parse(id).name;
          }
        },
      } : {}),
    },
  })), {
    input: './lib/index.ts',
    output: [{ file: `./dist/${name}.d.ts`, format: 'es' }],
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        declarationDir: './types',
        tsconfig: path.resolve('./tsconfig.json'),
        outputToFilesystem: true,
        incremental: false,
        include: ['lib/**/*.ts'],
        exclude: [
          '**/*.test.ts',
          '**/tests/**/*',
        ],
      }),
      ...defaultPlugins,
      {
        writeBundle () {
          fs.unlinkSync(`./dist/${name}.d.ts`);
        },
      },
    ],
  },
  // {
  //   input: './dist/types/index.d.ts',
  //   output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
  //   external: defaultExternals,
  //   plugins: [
  //     resolve({
  //       rootDir: path.resolve('../../'),
  //       extensions: ['.js', '.ts', '.json', '.node'],
  //     }),
  //     dts({ respectExternal: true }),
  //     {
  //       writeBundle () {
  //         fs.rmSync('./dist/types', { recursive: true, force: true });
  //       },
  //     },
  //   ],
  // },
];
