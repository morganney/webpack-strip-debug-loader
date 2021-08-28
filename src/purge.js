const purge = source => {
  // No Imports: /import\s.+\sfrom\s+'webpack-strip-debug-loader'|.*require\('webpack-strip-debug-loader'\).*/
  // No Declarations: /(var|let|const)?\s+debug(\w?)+\s*=\s*Debug\(.+\)/g
  // No Invocations: /\s+debug(\w?)+\(('[\w, ]+')?\)/g

  return source.replace(
    /(import\s.+\sfrom\s+'webpack-strip-debug-loader'|.*require\('webpack-strip-debug-loader'\).*)|((var|let|const)?\s+debug(\w?)+\s*=\s*Debug\(.+\))|(\s+debug(\w?)+\(('[\w, ]+')?\))/g,
    '\n'
  )
}

export { purge }
