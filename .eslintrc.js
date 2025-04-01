// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: [".eslintrc.js"],
  settings: {
    "import/resolver": {
      node: {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  rules: {
    // "prettier/prettier": "error",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        groups: [
          "builtin",
          "external",
          "internal",
          "unknown",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
      },
    ],
    // "@typescript-eslint/no-unused-vars": [
    //   "error",
    //   {
    //     args: "all",
    //     argsIgnorePattern: "^_",
    //     caughtErrors: "all",
    //     caughtErrorsIgnorePattern: "^_",
    //     destructuredArrayIgnorePattern: "^_",
    //     varsIgnorePattern: "^_",
    //     ignoreRestSiblings: true,
    //   },
    // ],
  },
};
