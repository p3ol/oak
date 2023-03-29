import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak-react';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom', '@oakjs/core', '@oakjs/core/addons',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@oakjs/core': 'OakCore',
  '@oakjs/core/addons': 'OakCoreAddons',
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
    name,
    sourcemap: true,
    globals,
    ...(format === 'esm' ? {
      manualChunks: id => {
        if (id.includes('node_modules')) {
          return 'vendor';
        } else if (/packages\/core\/lib/.test(id)) {
          const info = path.parse(id);

          if (/lib$/.test(info.dir)) {
            return info.name;
          } else {
            return `${info.dir.split('lib/').pop()}/${info.name}`;
          }
        }
      },
    } : {}),
  },
});

export default [
  ...formats.map(f => getConfig(f)),
  getConfig('esm', {
    output: './dist/no-junipero',
    defaultExternals: [
      ...defaultExternals,
      '@junipero/react',
    ],
    defaultGlobals: {
      ...defaultGlobals,
      '@junipero/react': 'JuniperoReact',
    },
  }),
  {
    input: './lib/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    plugins: [dts()],
  },
];
