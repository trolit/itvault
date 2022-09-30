/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:you-dont-need-lodash-underscore/compatible",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],

  overrides: [
    {
      files: [
        "**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}",
      ],

      extends: ["plugin:cypress/recommended"],
    },
  ],

  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],

    "vue/multi-word-component-names": "off",
  },

  parserOptions: {
    ecmaVersion: "latest",
  },
};
