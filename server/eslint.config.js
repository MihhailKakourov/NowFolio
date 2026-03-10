const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', 'prisma/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
            },
            parserOptions: {
                sourceType: 'commonjs',
            },
        },
        rules: {
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
