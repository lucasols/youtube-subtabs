// @ts-check
const path = require('path');
const webpack = require('webpack');

module.exports = /** @type { import('webpack').Configuration } */ {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      path.join(__dirname, '../src'),
      'node_modules',
    ],
  },
};
