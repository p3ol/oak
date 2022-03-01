module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
  projects: [
    '<rootDir>/packages/oak/jest.config.js',
    '<rootDir>/packages/oak-addon-basic-components/jest.config.js',
  ],
};
