/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
// const merge = require('webpack-merge');
const merge = require('webpack-merge');
const ExtensionReloader = require('webpack-extension-reloader');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const pkg = require('../package.json');
const baseManifest = require('../src/manifest.json');

module.exports = merge(commonConfig, /** @type { import('webpack').Configuration } */ {
  mode: 'development',
  watch: true,

  devtool: 'cheap-module-source-map',

  entry: {
    'content-script': './src/subTabs/index.tsx',
    popup: './src/settingsApp/index.tsx',
    background: './src/background.ts',
  },

  output: {
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dev'),
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
    new ExtensionReloader({
      reloadPage: true,
      manifest: path.resolve(__dirname, "../dev/manifest.json"),
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      __PROD__: false,
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
        extend: {
          version: pkg.version,
          background: {
            scripts: ["background.js"],
            persistent: true,
          },
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: 'src/settingsApp/index.ejs',
      chunks: ['popup'],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
});
