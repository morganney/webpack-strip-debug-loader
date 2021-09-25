import { jest } from '@jest/globals'

import { loader } from '../src/loader.js'

describe('loader', () => {
  const getStub = () => ({
    callback: jest.fn((err, purgedSrc) => {
      return purgedSrc
    })
  })

  it('removes debug usage', () => {
    const stub = getStub()
    let src = 'import { Debug } from "webpack-strip-debug-loader"'

    loader.call(stub, src)
    expect(stub.callback).toHaveBeenLastCalledWith(null, '\n', undefined, undefined)

    src = 'debug("something")'
    loader.call(stub, src)
    expect(stub.callback).toHaveBeenLastCalledWith(null, '\n', undefined, undefined)

    src = `if (true) {
      debug(String.prototype.includes('foo'))
    }`
    loader.call(stub, src)
    expect(stub.callback).toHaveBeenLastCalledWith(
      null,
      `if (true) {

    }`,
      undefined,
      undefined
    )
  })
})
