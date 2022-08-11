module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  "ignorePatterns": ["**/*.json","dist/**"],
  parserOptions: {
    ecmaVersion: '2021',
    sourceType: 'module',
    "project": ["./tsconfig.json"] 
  },
  plugins: [
    'import',
    '@typescript-eslint'
  ],
  rules: {
    'no-debugger': 'off',
    'no-console': 0,
    '@typescript-eslint/no-explicit-any': 'error',
    'class-methods-use-this': 'off'
  }
}
