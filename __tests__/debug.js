import { jest } from '@jest/globals'

import { Debug } from '../src/debug.js'

jest.mock('debug')

let debug = null

describe('Debug', () => {
  beforeAll(async () => {
    ;({ default: debug } = await import('debug'))
  })

  it('wraps debug', () => {
    Debug('namespace')

    expect(debug).toHaveBeenCalled()
  })
})
