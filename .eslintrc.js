module.exports = {
  extends: [
    'plugin:flowtype/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  parser: '@babel/eslint-parser',
  plugins: ['flowtype', 'react', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
