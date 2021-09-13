module.exports = function (api) {
  const env = process.env.NODE_ENV || 'development'
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['defaults', 'current node']
        },
        modules: 'commonjs'
      }
    ]
  ]

  api.cache(() => env === 'development')

  return {
    presets
  }
}
