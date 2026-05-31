module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'never', component: 'always' },
    }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
  },
  ignorePatterns: ['dist', 'node_modules', '*.cjs'],
};