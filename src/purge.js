const purge = source => {
  // No Imports: /import\s.+\sfrom\s+['"]webpack-strip-debug-loader['"]|.*require\(['"]webpack-strip-debug-loader['"]\).*/
  // No Declarations: /(var|let|const)?\s+debug(\w?)+\s*=\s*Debug\([\s\S]*?.*\)/g
  // No Invocations: /\s*debug(\w?)+\s*?\([\s\S]*?.*\s*\)(?![\),])/g

  return source.replace(
    /(import\s.+\sfrom\s+['"]webpack-strip-debug-loader['"]|.*require\(['"]webpack-strip-debug-loader['"]\).*)|((var|let|const)?\s+debug(\w?)+\s*=\s*Debug\([\s\S]*?.*\))|(\s*debug(\w?)+\s*?\([\s\S]*?.*\s*\)(?![\),]))/g,
    '\n'
  )
}

export { purge }
