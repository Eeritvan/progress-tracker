import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactPlugin from 'eslint-plugin-react'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  ...pluginQuery.configs['flat/recommended'],
  { ignores: ['dist', 'playwright.config.ts', 'e2e'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      eqeqeq: ['error'],
      camelcase: ['error', { 'properties': 'always' }],
      'no-trailing-spaces': ['error'],
      'linebreak-style': ['error', 'unix'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'object-curly-spacing': ['error', 'always'],
      'max-len': ['error', 80],
      'no-console': ['error'],
      'no-duplicate-imports': ['error'],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      "eol-last": ['error', "always"],
      'comma-dangle': ['error', 'never'],
      'max-depth': ['error', 2],
      'no-else-return': ['error'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'react/jsx-closing-bracket-location': ['error'],
      'react/prefer-stateless-function': ['error'],
      'react/no-multi-comp': ['error'],
      'react/sort-comp': ['error'],
      'react/self-closing-comp': ['error'],
      'react/jsx-wrap-multilines': ['error']
    }
  }
)
