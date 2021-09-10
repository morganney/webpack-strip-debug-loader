import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { imports, declarations, invocations, debugCode, purge } from '../src/purge.js'

describe('purge', () => {
  const filename = fileURLToPath(import.meta.url)
  let file = ''

  beforeAll(() => {
    file = fs.readFileSync(join(dirname(filename), '__fixtures__/file.js'))
  })

  it('removes imports for Debug', () => {
    expect(purge("import { Debug } from 'webpack-strip-debug-loader'")).toBe('\n')
    expect(purge('import {Debug} from "webpack-strip-debug-loader"')).toBe('\n')
    expect(purge(`import {
      Debug
    } from 'webpack-strip-debug-loader'`)).toBe('\n')
  })

  it('removes requires for Debug', () => {
    expect(purge("const { Debug } = require('webpack-strip-debug-loader')")).toBe('\n')
    expect(purge('const debugFunc = require("webpack-strip-debug-loader").Debug')).toBe(
      '\n'
    )
  })

  it('removes declarations with Debug', () => {
    expect(purge('const debug = Debug("foo")')).toBe('\n')
    expect(purge('var debugFoo=Debug()')).toBe('\n')
    expect(purge("let debug = Debug('let')")).toBe('\n')
    expect(purge("  debug   =Debug('test')")).toBe('\n')
  })

  it('removes invocations of a function prefixed with "debug"', () => {
    expect(purge("debug('test:it')")).toBe('\n')
    expect(
      purge(`debug(
      foo,
      "bar",
      'bar',
      funcCall(bar),
      { ...spread },
      boo()
    )`)
    ).toBe('\n')
    expect(purge('debugFoo(foo, someFunc("test"))')).toBe('\n')
    expect(purge('debugger("gone")')).toBe('\n')
    expect(purge('debu("miss")')).toBe('debu("miss")')
  })

  it('removes all Debug import and require statements from a file', () => {
    expect(purge(file.toString())).toEqual(
      expect.not.stringMatching(new RegExp(imports, 'g'))
    )
  })

  it('removes all declarations using Debug from a file', () => {
    expect(purge(file.toString())).toEqual(
      expect.not.stringMatching(new RegExp(declarations, 'g'))
    )
  })

  it('removes all invocations of a function prefixed with "debug" from a file', () => {
    expect(purge(file.toString())).toEqual(
      expect.not.stringMatching(new RegExp(invocations, 'g'))
    )
  })

  it('removes all imports, requires, declarations and invocations from a file', () => {
    expect(purge(file.toString())).toEqual(
      expect.not.stringMatching(new RegExp(debugCode, 'g'))
    )
  })
})
