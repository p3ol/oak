import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const input = './lib/index.ts';
const defaultOutput = './dist';
const name = 'oak-react';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules\/(?!@oakjs)/,
    babelHelpers: 'runtime',
  }),
  alias({
    entries: [
      { find: '@oakjs/core', replacement: path.resolve('../core/lib') },
    ],
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs(),
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
