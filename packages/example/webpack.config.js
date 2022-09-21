const { join } = require("node:path");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

module.exports = {
  target: "web",
  mode: "development",
  context: __dirname,
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    path: join(__dirname, "build"),
    clean: true,
    filename: `[contenthash:20].js`,
    chunkFilename: `[contenthash:20].js`,
    assetModuleFilename: `[contenthash:20][ext]`,
  },
  resolve: {
    plugins: [new ResolveTypeScriptPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        use: "source-map-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\/assets\//,
        type: "asset/resource",
      },
    ],
  },
  devtool: "source-map",
  plugins: [
    new DefinePlugin({
      "typeof window": JSON.stringify("object"),
    }),
    new HtmlWebpackPlugin({
      title: "Example Application",
      scriptLoading: "defer",
    }),
  ],
};
