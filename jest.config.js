export default {
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  testMatch: [
    '**/__tests__/**/*.js',
    // Has to wait for better ESM support from webpack
    '!**/__tests__/loader.js',
    /**
     * Has to wait for better support for mocks when using ESM
     * @see https://github.com/facebook/jest/pull/10976
     */
    '!**/__tests__/debug.js',
    '!**/__tests__/__fixtures__/*.js'
  ],
  transform: {}
}
