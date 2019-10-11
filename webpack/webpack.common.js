// @ts-check
const path = require('path');
const webpack = require('webpack');

module.exports = /** @type { import('webpack').Configuration } */ {
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      __PROD__: false,
      __HOT__: true,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
};
