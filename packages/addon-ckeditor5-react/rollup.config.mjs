import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import terser from '@rollup/plugin-terser';
import tailwindcss from 'tailwindcss';

const input = './lib/index.js';
const defaultOutput = './dist';
const name = 'oak-addon-ckeditor';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom', '@oakjs/react', '@oakjs/ckeditor5-build-custom',
  '@ckeditor/ckeditor5-react',
];

const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@oakjs/react': 'OakReact',
  '@ckeditor/ckeditor5-react': 'CKEditorReact',
  '@oakjs/ckeditor5-build-custom': 'ClassicEditor',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs({
    include: /node_modules/,
    requireReturnsDefault: 'auto',
  }),
  terser(),
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
            ],
          },
        },
        plugins: [
          tailwindcss({ config: path.resolve('../../tailwind.config.js') }),
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
