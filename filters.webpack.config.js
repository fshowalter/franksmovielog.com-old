const { resolve } = require("path");

module.exports = {
  entry: "./external/scripts/filters/tsconfig.json",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        options: {
          configFile: resolve(
            __dirname,
            "external",
            "scripts",
            "filters",
            "tsconfig.json"
          ),
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  },
  output: {
    filename: "filters.js",
    path: resolve(__dirname, "static", "scripts"),
  },
};
