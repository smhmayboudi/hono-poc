// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-require-imports, no-undef */

const path = require("node:path");

const CopyPlugin = require("copy-webpack-plugin");
const GlobEntries = require("webpack-glob-entries");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  devtool: "source-map",
  entry: GlobEntries("./src/*.ts"),
  externals: /^(k6|https?:\/\/)(\/.*)?/,
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs",
    path: path.join(__dirname, "./build/"),
    sourceMapFilename: "[file].map",
  },
  performance: false,
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "./assets/"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  stats: {
    colors: true,
  },
  target: ["es5", "web"],
};
