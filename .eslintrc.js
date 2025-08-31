module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:flowtype/recommended',
    'prettier'
  ],
  plugins: ['react', 'react-hooks', 'flowtype', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  settings: {
    react: {
      version: '18.2.0'
    }
  },
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': [
      'error',
      {argsIgnorePattern: '^_', ignoreRestSiblings: true}
    ],
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', '__tests__/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
}
