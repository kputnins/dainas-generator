module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'arrow-parens': 0,
    'react/button-has-type': 0,
    'object-curly-newline': 0,
    'no-plusplus': 0,
    'max-len': ['error', { code: 120 }],
    'no-await-in-loop': 0,
  },
};
