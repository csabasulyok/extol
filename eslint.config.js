// @ts-check
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import { configs as tseslintConfigs } from 'typescript-eslint';

export default defineConfig(
  // Files to ignore entirely
  {
    ignores: [
      '**/*.js',
      'dist/**',
      'build/',
      'node_modules/**',
      'coverage/**',
      '.idea/',
      '.vscode/',
      'docs/',
      'jsdoc/',
      'tmp/',
    ],
  },

  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript strict + stylistic rules (applied to TS files)
  ...tseslintConfigs.strictTypeChecked,
  ...tseslintConfigs.stylisticTypeChecked,

  // Node.js rules
  n.configs['flat/recommended'],

  // Unicorn — modern JS idioms
  unicorn.configs.recommended,

  // import-x — module graph correctness and ordering
  // Cast needed: PluginFlatConfig.languageOptions is narrower than ConfigWithExtends expects
  /** @type {any} */ (importX.flatConfigs.recommended),
  /** @type {any} */ (importX.flatConfigs.typescript),

  // Prettier integration — disables conflicting ESLint formatting rules
  // and adds prettier/prettier as an ESLint rule
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // TypeScript-specific configuration
  {
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
        // project: ['./tsconfig.eslint.json'],
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── typescript-eslint ────────────────────────────────────────────────
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true, ignoreVoid: true }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',

      // ── eslint-plugin-n ──────────────────────────────────────────────────
      'n/no-unsupported-features/node-builtins': ['error', { version: '>=24.0.0' }],
      'n/no-unsupported-features/es-builtins': ['error', { version: '>=24.0.0' }],
      'n/no-unsupported-features/es-syntax': ['error', { version: '>=24.0.0' }],
      // Prefer the node: protocol for built-in imports (e.g. node:fs, node:path)
      'n/prefer-node-protocol': 'error',
      // Enforce .js extensions on relative ESM imports (required for NodeNext)
      'n/file-extension-in-import': ['error', 'always'],
      // Don't call process.exit() directly; throw a typed error instead
      'n/no-process-exit': 'off',
      // n/no-missing-import is handled better by import-x; disable to avoid duplication
      'n/no-missing-import': 'off',
      // n/no-unpublished-import is noisy in a non-published CLI; disable
      'n/no-unpublished-import': 'off',

      'n/hashbang': [
        'error',
        {
          ignoreUnpublished: true,
          additionalExecutables: ['bin/*.ts'],
          executableMap: {
            '.js': 'node',
            '.ts': 'tsx',
          },
        },
      ],

      // ── eslint-plugin-unicorn ────────────────────────────────────────────
      // Enforce kebab-case filenames (standard Node.js convention)
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      // Prefer for...of over forEach
      'unicorn/no-array-for-each': 'error',
      // Bans require(), __dirname, __filename (already ESM)
      'unicorn/prefer-module': 'error',
      // Prefer node: protocol — redundant with n/prefer-node-protocol but belt-and-suspenders
      'unicorn/prefer-node-protocol': 'error',
      // Top-level await is fine in ESM CLI entry points
      'unicorn/prefer-top-level-await': 'error',
      // These unicorn rules conflict with our style or typescript-eslint equivalents
      'unicorn/no-null': 'off', // TypeScript APIs use null legitimately
      'unicorn/prevent-abbreviations': 'off', // Too noisy for a codebase with established names
      'unicorn/no-negated-condition': 'off', // Sometimes clearer to negate a condition than to invert the whole logic
      'unicorn/no-array-reduce': 'off', // Sometimes reduce is clearer than a for loop or map+filter+etc.
      'unicorn/no-process-exit': 'off', // Legitimate in CLI tools
      'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }], // Sometimes clearer to define a helper function inside another function, especially if it's only used there

      // ── eslint-plugin-import-x ───────────────────────────────────────────
      // No duplicate import statements for the same module
      'import-x/no-duplicates': 'error',
      // Detect circular dependencies
      'import-x/no-cycle': 'error',
      // Enforce consistent import ordering
      'import-x/order': [
        'error',
        {
          groups: [
            ['builtin', 'external', 'internal'],
            ['parent', 'sibling'],
          ],
          'newlines-between': 'never',
          alphabetize: { order: 'ignore', caseInsensitive: true },
        },
      ],
      // Catch imports of packages not listed in package.json
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-named-as-default-member': 'off', // False positives with TypeScript namespaces
    },
  },
);
