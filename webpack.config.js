const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const babelrc = JSON.parse(fs.readFileSync("./.babelrc"));

module.exports = {
  target: "node",
  devtool: "eval",

  context: __dirname,
  entry: "./src/index.js",

  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")]
  },

  output: {
    library: "HJSON",
    filename: "index.js",
    libraryExport: "default",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist")
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelrc
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ]
};
