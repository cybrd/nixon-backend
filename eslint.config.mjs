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
    "id-length": 0,
    "max-lines-per-function": ["error", { max: 100 }],
    "max-statements": ["error", { max: 20 }],
    "new-cap": 0,
    "no-console": 0,
    "one-var": 0,
    "sort-imports": ["error", { allowSeparatedGroups: true }],
  },
});
