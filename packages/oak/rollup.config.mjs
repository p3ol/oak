import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import url from 'postcss-url';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['react', 'react-dom'];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
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
        } else if (/packages\/oak\/lib/.test(id)) {
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
              path.resolve('./lib/theme'),
            ],
          },
        },
        plugins: [
          url({
            url: 'copy',
            useHash: true,
            basePath: path.resolve('./lib/theme/fonts'),
            assetsPath: path.resolve('./dist/assets'),
          }),
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
