import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    '.turbo',
    'tests/',
  ],
  projects: [
    '<rootDir>/packages/core/jest.config.ts',
    '<rootDir>/packages/react/jest.config.ts',
  ],
};

export default config;
