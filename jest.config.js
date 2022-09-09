module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/*{.settings,.config,.stories}.js',
    '!**/*{schema,components,defaults,fields}.js',
  ],
  projects: [
    '<rootDir>/packages/oak/jest.config.js',
    '<rootDir>/packages/oak-addon-basic-components/jest.config.js',
    '<rootDir>/packages/oak-addon-richtext-field-prosemirror/jest.config.js',
  ],
};
