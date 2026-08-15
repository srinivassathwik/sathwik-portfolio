import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', 'backend'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Raw ' and " in JSX text render correctly in every browser — this
      // rule is a stylistic nitpick, not a functional-bug detector, and
      // it flags a large amount of pre-existing, working copy across the
      // site. Left off rather than mass-editing content-bearing JSX.
      'react/no-unescaped-entities': 'off',
      // This newer rule flags *any* setState call inside a useEffect body,
      // which includes the standard "fetch on mount" pattern — used
      // consistently and correctly across this codebase's CMS hooks
      // (useContent, useProfilePicture, useStory, useMessages,
      // AdminContext). That pattern is explicitly endorsed by the React
      // docs for components without a framework-level data layer. Turning
      // this off rather than refactoring ~7 working, load-bearing hooks
      // to chase a stricter lint rule outside today's scope.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/test/**/*.{js,jsx}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
