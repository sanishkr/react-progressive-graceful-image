module.exports = {
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: 'lf',
  bracketSpacing: true,
  arrowParens: 'avoid',
  jsxSingleQuote: true,
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 72
      }
    }
  ]
};
