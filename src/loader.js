import { purge } from './purge'

const loader = function(source, map, meta) {
  this.callback(null, purge(source), map, meta)
}

export { loader }
