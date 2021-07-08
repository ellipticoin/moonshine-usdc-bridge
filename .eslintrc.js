module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
  ],
  globals: {
    Atomics: "readonly",
    import: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    "react",
  ],
  rules: {
    quotes: [2, "double"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": [0],
    "no-shadow": [0],
    "no-alert": [0],
    "no-underscore-dangle": [0],
    "no-use-before-define": [0],
  },
};
