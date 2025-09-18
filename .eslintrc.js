module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['error'],
    // allow 'any' in the project
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
};
