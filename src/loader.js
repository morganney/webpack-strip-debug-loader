const purge = require('./purge')
const debug = require('./debug')

const loader = function(source, map, meta) {
  this.callback(null, purge(source), map, meta)
}

loader.Debug = debug

module.exports = loader
