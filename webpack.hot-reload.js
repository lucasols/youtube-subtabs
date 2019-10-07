// @ts-check
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonsConfig = require('./webpack.common');
const ReactRefreshPlugin = require('react-refresh-webpack-plugin');

module.exports = /** @type { import('webpack').Configuration } */ {
  ...commonsConfig,

  mode: 'development',

  devtool: 'cheap-module-source-map',

  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    './src/settings/index',
  ],

  output: {
    pathinfo: true,
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },

  plugins: [
    new ReactRefreshPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/settings/index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      __PROD__: false,
      __HOT__: true,
    }),
  ],
};
