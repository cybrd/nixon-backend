import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.all, ...tseslint.configs.strict, {
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
    },
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    complexity: ["error", { max: 30 }],
    "id-length": 0,
    "max-lines": ["error", { max: 500 }],
    "max-lines-per-function": ["error", { max: 200 }],
    "max-params": ["error", { max: 4 }],
    "max-statements": ["error", { max: 40 }],
    "new-cap": 0,
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-use-before-define": 0,
    "one-var": 0,
    "require-atomic-updates": ["error", { allowProperties: true }],
    "sort-imports": ["error", { allowSeparatedGroups: true }],
  },
});
