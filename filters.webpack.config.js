const { resolve } = require("path");

module.exports = {
  entry: "./src/utils/filtering.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        options: {
          configFile: resolve(__dirname, "tsconfig.filters.json"),
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  },
  output: {
    filename: "filters.js",
    path: resolve(__dirname, "public", "scripts"),
  },
};
