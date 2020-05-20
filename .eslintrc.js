// Using .js to allow comments
module.exports = {
  root: true,
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  ignorePatterns: ["node_modules/", "static/", "public/"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: [
        "airbnb",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jest/all",
        "prettier",
        "prettier/react",
        "prettier/@typescript-eslint",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: [
        "react",
        "jest",
        "jsx-a11y",
        "import",
        "prettier",
        "@typescript-eslint",
      ],
      rules: {
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
          },
        ],
        "jest/lowercase-name": [
          "error",
          {
            ignore: ["describe"],
          },
        ],
        "no-useless-constructor": "off",
        "react/jsx-filename-extension": [
          2,
          { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        ],
      },
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          node: {
            paths: ["./src"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
          },
          typescript: {
            directory: [
              "./tsconfig.json",
              "external/scripts/filters/tsconfig.json",
              "external/scripts/loadImages/tsconfig.json",
              "external/scripts/toggleMenu/tsconfig.json",
            ],
          },
        },
      },
    },
  ],
};
