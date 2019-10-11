/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
// const merge = require('webpack-merge');
const merge = require('webpack-merge');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = merge(commonConfig, /** @type { import('webpack').Configuration } */ {
  mode: 'development',
  watch: true,

  entry: {
    subTabs: './src/subTabs/index.tsx',
    settingsApp: './src/settingsApp/index.tsx',
    background: './src/background.ts',
  },

  output: {
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist/js'),
    publicPath: '',
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

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      __PROD__: false,
    }),
    new HtmlWebpackPlugin({
      template: 'src/settingsApp/index.html',
      chunks: ['settingsApp'],
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!static*', '!icons*'],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtensionReloader(),
  ],
});
