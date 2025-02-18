import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,jsx,mjs,cjs,vue}"],
    ignores: ["public/**/*", 'dist/**/*', 'node_modules/**', '.vscode/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      'max-len': 'off',
      'vue/multi-word-component-names': 'off',
      'no-restricted-syntax': 'warn',
      'no-param-reassign': 'warn',
      'prefer-const': 'warn',
      'no-unused-expressions': 'warn',
      'no-unused-vars': 'warn',
      'vue/no-unused-vars': 'warn',
      'no-plusplus': 'warn',
      'consistent-return': 'off',
      'no-use-before-define': 'warn',
      'no-debugger': 'warn',
      'import/prefer-default-export': 'off',
      'eol-last': 'off',
      'vue/comment-directive': 'off',
      'no-bitwise': 'warn',
      'no-restricted-globals': 'warn',
      'indent': 'off',
    }
  }
];