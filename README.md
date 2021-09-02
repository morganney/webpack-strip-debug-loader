# webpack-strip-debug-loader

Removes [`debug`](https://www.npmjs.com/package/debug) usage from your source code during Webpack builds.

## Usage

First `npm install webpack-strip-debug-loader debug`.

### Debugging

You must use the wrapper around [`debug`](https://www.npmjs.com/package/debug) named `Debug` that this package exposes. All debug functions must be prefixed with `debug` or they will not be removed.

Do not:
* Alias your `import` or `require` of `Debug`
* Spread your `import` of `require` of `Debug` over more than one line
* Put more than one `debug()` call on a single line
* Other crazy things

Just make simple debug statements.

```js
import { Debug } from 'webpack-strip-debug-loader'

// Or use require if you prefer that
const { Debug } = require("webpack-strip-debug-loader")

const debug = Debug("feature")
const debugFoo = Debug('foo')

if (somethingOfInterestHappens) {
  debug("something happened")
}

if (foo) {
  debugFoo(
    'foo happened',
    foo,
    { ...foo }
  )
}
```

### Stripping

To remove the logging and bundling of debug usage register this loader with Webpack.

```js
module: {
  rules: [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['webpack-strip-debug-loader']
    }
  ]
}
```
