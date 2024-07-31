import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.all, ...tseslint.configs.strict, {
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "id-length": 0,
    "new-cap": 0,
    "no-console": 0,
    "one-var": 0,
    "sort-imports": ["error", { allowSeparatedGroups: true }],
  },
});
