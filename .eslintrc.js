module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'hexagonal-architecture'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      "plugin:import/typescript"
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",
      "hexagonal-architecture/enforce": ["error"],
      'prettier/prettier': ['off', { singleQuote: true }],
    },
  };
  