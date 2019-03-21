const path = require("path");
const webpack = require("webpack");

const EnvironmentPlugin = new webpack.EnvironmentPlugin({
  NODE_ENV: process.env.NODE_ENV
});

const plugins = [EnvironmentPlugin];

module.exports = {
  entry: {
    main: ["./src/index.ts"]
  },
  devtool:
    process.env.NODE_ENV === "development" ? "inline-source-map" : "source-map",
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    library: "ecs-next",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "ts-loader"
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: plugins,
  resolve: { extensions: [".ts", ".js", ".css", ".json"] }
};
