import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['projects/**/*']
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts']
    })),
  {
    files: ['**/*.ts'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      }
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  ...compat.extends('plugin:@angular-eslint/template/recommended').map((config) => ({
    ...config,
    files: ['**/*.html']
  })),
  {
    files: ['**/*.html'],
    rules: {}
  }
];
