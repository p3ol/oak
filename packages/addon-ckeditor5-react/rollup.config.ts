import path from 'node:path';

import type { ModuleFormat, Plugin, RollupOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import swc from '@rollup/plugin-swc';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const input = './lib/index.ts';
const defaultOutput = './dist';
const name = 'oak-addon-ckeditor';
const formats: ModuleFormat[] = ['umd', 'cjs', 'esm'];

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
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  }),
  commonjs({
    include: /node_modules/,
  }),
  terser(),
];

const getConfig = (format: ModuleFormat, {
  output = defaultOutput,
  external = defaultExternals,
  globals = defaultGlobals,
}: {
  output?: string;
  external?: string[];
  globals?: Record<string, string>;
} = {}): RollupOptions => ({
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
        } else {
          return path.parse(id).name;
        }
      },
    } : {}),
  },
});

const config: RollupOptions[] = [
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
          stylus: {},
          less: {},
        },
        plugins: [
          autoprefixer,
          tailwindcss({ config: path.resolve('../../tailwind.config.ts') }),
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

export default config;
