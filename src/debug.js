const debug = require('debug')

// Redirect output from stderr to console.log for browser environments
debug.log = console.log.bind(console)

const Debug = namespace => debug(namespace)

module.exports = Debug
