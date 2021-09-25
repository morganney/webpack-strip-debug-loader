import path from 'path'
import { fileURLToPath } from 'url'

import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

import { debugCode } from '../src/purge.js'

const { dirname, resolve } = path
const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)
const build = entry => {
  const compiler = webpack({
    context: directory,
    entry: `./${entry}`,
    output: {
      path: resolve(directory),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          type: 'module',
          loader: resolve(directory, '../src/loader.js')
        }
      ]
    }
  })

  compiler.outputFileSystem.join = path.join.bind(path)
  compiler.outputFileSystem = createFsFromVolume(new Volume())

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        return reject(stats.toJson().errors)
      }

      return resolve(stats)
    })
  })
}

describe('loader', () => {
  it('is used by webpack to remove debug code from source files', async () => {
    const stats = await build('__fixtures__/file.js')
    const output = stats.toJson({ source: true }).modules[0].source

    expect(output).toEqual(expect.not.stringContaining(new RegExp(debugCode, 'g')))
  })
})
