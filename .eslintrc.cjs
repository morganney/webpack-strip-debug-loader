module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: '2020',
    sourceType: 'module',
    babelOptions: {
      plugins: ['@babel/plugin-syntax-import-attributes']
    }
  },
  plugins: ['jest', 'prettier']
}
