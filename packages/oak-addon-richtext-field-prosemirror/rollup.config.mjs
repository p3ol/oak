import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import terser from '@rollup/plugin-terser';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak-addon-richtext-field-prosemirror';
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
  // Will use preact when compat will be stable again
  // alias({
  //   entries: [
  //     { find: 'react', replacement: 'preact/compat' },
  //     { find: 'react-dom', replacement: 'preact/compat' },
  //   ],
  // }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs(),
  terser({
    mangle: false,
  }),
];

const getConfig = (format, {
  output = defaultOutput,
  external = defaultExternals,
  globals = defaultGlobals,
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
    exports: 'named',
    ...(format === 'esm' ? {
      manualChunks: id => {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    } : {}),
  },
});

export default [
  ...formats.map(f => getConfig(f)),
  {
    input: './lib/index.sass',
    plugins: [
      postcss({
        extensions: ['.sass'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        modules: false,
        use: {
          sass: {
            includePaths: [
              path.resolve('node_modules'),
              path.resolve('../../node_modules'),
              path.resolve('../oak/lib/theme'),
            ],
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
