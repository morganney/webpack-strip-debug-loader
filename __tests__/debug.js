import { Debug } from '../src/debug.js'

/**
 * Testing that it wraps `debug` has to wait for better
 * support for mocks when using ESM
 * @see https://github.com/facebook/jest/pull/10976
 */
describe('Debug', () => {
  it('returns a function', () => {
    expect(Debug('test')).toEqual(expect.any(Function))
  })
})
