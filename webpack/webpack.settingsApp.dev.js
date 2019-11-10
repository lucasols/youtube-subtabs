const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('react-refresh-webpack-plugin');
const commonConfig = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(commonConfig, /** @type { import('webpack').Configuration } */ {
  mode: 'development',

  devtool: 'cheap-module-source-map',

  entry: [
    './src/settingsApp/index',
  ],

  output: {
    pathinfo: true,
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
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
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      __PROD__: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/settingsApp/index.ejs',
    }),
  ],
});
