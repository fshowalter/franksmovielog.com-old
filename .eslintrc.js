// Using .js to allow comments
module.exports = {
  root: true,
  extends: ["airbnb", "plugin:prettier/recommended"],
  ignorePatterns: ["node_modules/", "static/", "public/"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      env: {
        "jest/globals": true,
      },
      extends: [
        "airbnb",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier/react",
        "plugin:jest/all",
        "plugin:prettier/recommended",
      ],
      parser: "esprima",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["jest", "@typescript-eslint"],
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
        "react/jsx-filename-extension": [
          2,
          { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        ],

        // "@typescript-eslint/indent": ["off"],
        // "@typescript-eslint/no-useless-constructor": "error",
        // "@typescript-eslint/triple-slash-reference": ["off"],
        // "@typescript-eslint/unbound-method": [
        //   "error",
        //   {
        //     ignoreStatic: true,
        //   },
        // ],

        // "no-useless-constructor": "off",
        // "spaced-comment": ["off"],
        // "react/jsx-filename-extension": [
        //   2,
        //   { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        // ],
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
