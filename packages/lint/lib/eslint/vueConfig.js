export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    'plugin:vue/vue3-essential',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    "vue/max-attributes-per-line": 'off',
  },
};
