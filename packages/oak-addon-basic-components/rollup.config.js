import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak-addon-basic-components';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['@poool/oak'];
const defaultGlobals = { '@poool/oak': 'oak' };

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
    exports: 'auto',
  },
  ...(format === 'esm' ? {
    manualChunks: id => {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
  } : {}),
});

export default [
  ...formats.map(f => getConfig(f, {
    output: `${defaultOutput}/standalone`,
  })),
  ...formats.map(f => getConfig(f, {
    external: ['@poool/oak', 'react', 'react-dom'],
    globals: { '@poool/oak': 'oak', react: 'React', 'react-dom': 'ReactDOM' },
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
        modules: false,
        use: {
          stylus: {
            paths: [
              path.resolve('node_modules'),
              path.resolve('../../node_modules'),
            ],
            includeCSS: true,
          },
        },
        plugins: [
          autoprefixer({ env: process.env.BROWSERSLIST_ENV }),
        ],
      }),
    ],
    output: {
      file: `${defaultOutput}/${name}.min.css`,
    },
    onwarn: (warning, warn) => {
      if (warning.code === 'FILE_NAME_CONFLICT') {
        return;
      }

      warn(warning);
    },
  },
];
