import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import globals from 'globals'

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', '.sdlc/', '.claude/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['public/sw.js'],
    languageOptions: { globals: globals.serviceworker },
  },
]
