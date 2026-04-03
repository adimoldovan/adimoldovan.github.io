import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-param-reassign': 'error',
    },
  },
  {
    files: ['webpack.*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
