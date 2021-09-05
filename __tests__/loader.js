import path, { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

import { debugCode } from '../src/purge.js'

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
          use: {
            loader: resolve(directory, '../src/loader.js')
          }
        }
      ]
    }
  })

  compiler.outputFileSystem = createFsFromVolume(new Volume())
  compiler.outputFileSystem.join = join.bind(path)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }

      if (stats.hasErrors()) {
        reject(stats.toJson().errors)
      }

      resolve(stats)
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
