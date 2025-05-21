import * as path from "node:path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import glob from "glob";
import { Configuration } from "webpack";

const GlobEntries = (globPath: string) => {
  const files = glob.sync(globPath);
  const entries: Record<string, string> = {};

  for (const entry of files) {
    entries[path.basename(entry, path.extname(entry))] = `./${entry}`;
  }

  return entries;
};
const config: Configuration = {
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

export default config;
