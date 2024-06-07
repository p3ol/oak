import path from 'node:path';

import type { ModuleFormat, Plugin } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import swc from '@rollup/plugin-swc';

const input = './lib/index.ts';
const defaultOutput = './dist';
const name = 'oak-react';
const formats: ModuleFormat[] = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const defaultPlugins: Plugin[] = [
  swc({
    swc: {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
      },
    },
  }),
  alias({
    entries: [
      { find: '@oakjs/core', replacement: path.resolve('../core/lib') },
    ],
  }),
  commonjs({ include: /node_modules/ }),
  resolve({
    extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
  }),
  terser(),
];

const getConfig = (format: string, {
  output = defaultOutput,
  globals = defaultGlobals,
  external = defaultExternals,
}: {
  output?: string;
  globals?: Record<string, string>;
  external?: string[];
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
    name,
    sourcemap: true,
    globals,
    ...(format === 'esm' ? {
      manualChunks: (id: string) => {
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
  getConfig('esm', {
    output: './dist/no-junipero',
    external: [
      ...defaultExternals,
      '@junipero/react',
    ],
    globals: {
      ...defaultGlobals,
      '@junipero/react': 'JuniperoReact',
    },
  }),
];
