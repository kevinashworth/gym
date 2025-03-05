// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  ignorePatterns: ["/dist/*"],
  settings: {
    "import/resolver": {
      node: {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
  },
  rules: {
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
          {
            pattern: "~/**",
            group: "external",
            position: "after",
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
  },
};
