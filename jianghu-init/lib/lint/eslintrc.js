module.exports = {
  extends: [
    'eslint-config-egg',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'html',
    'jianghu'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'warn'
  },
  overrides: [
    {
      files: ['app/view/page/*.html'],
      rules: {
        'jianghu/check-vue-methods-douiaction': 'error',
      },
    },
    {
      files: ['app/service/*.js'],
      rules: {
        'jianghu/check-service-action-data-scheme': 'error',
      },
    },
  ],
};
