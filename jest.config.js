export default {
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  modulePathIgnorePatterns: ['dist'],
  testMatch: [
    '**/__tests__/**/*.js',
    /**
     * Has to wait for better ESM suport for webpack loaders
     * @see https://github.com/webpack/loader-runner/issues/61
     */
    '!**/__tests__/integration.js',
    '!**/__tests__/__fixtures__/*.js'
  ],
  transform: {}
}
