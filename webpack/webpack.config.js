/* eslint-disable @typescript-eslint/camelcase */

const path = require('path');
const workboxPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common');
const merge = require('webpack-merge');

const folder = './dist';

module.exports = merge(commonConfig, /** @type { import('webpack').Configuration } */ {
  mode: 'production',

  entry: {
    main: './src/index.tsx',
  },

  output: {
    path: path.join(__dirname, folder),
    filename: '[name].[contenthash:8].js',
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          toplevel: true,
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            passes: 2,
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            // eslint-disable-next-line @typescript-eslint/camelcase
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 30 * 1000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      __PROD__: true,
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`**/*`, `!static*`, '!icons*'],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      exclude: ['index.html', 'icons'],
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'cdn',
      runtimeCaching: [
        {
          urlPattern: new RegExp(
            '^https://fonts.(?:googleapis|gstatic).com/(.*)',
          ),
          handler: 'CacheFirst',
          options: {
            cacheName: 'googleFonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: '/static',
          handler: 'CacheFirst',
        },
        {
          urlPattern: '/index.html',
          handler: 'NetworkFirst',
        },
      ],
    }),
  ],
});
