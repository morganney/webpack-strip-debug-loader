const imports =
  /import\s.+\sfrom\s+['"]webpack-strip-debug-loader['"]|.*require\(['"]webpack-strip-debug-loader['"]\).*/
const declarations = /(var|let|const)?\s*debug(\w?)+\s*=\s*Debug\([\s\S]*?.*\)/
const invocations = /\s*debug(\w?)+\s*?\([\s\S]*?.*\s*\)(?![),])/
const debugCode = new RegExp(
  `${imports.source}|${declarations.source}|${invocations.source}`,
  'g'
)
const purge = source => source.replace(debugCode, '\n')

export { imports, declarations, invocations, debugCode, purge }
