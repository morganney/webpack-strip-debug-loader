import fs from 'fs'

import pkg from './package.json'

/**
 * Remove "type": "module" until webpack supports ES modules better
 */
delete pkg.type

pkg.main = 'index.js'

fs.writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 2))
