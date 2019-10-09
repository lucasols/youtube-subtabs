const path = require('path');

module.exports = /** @type { import('webpack').Configuration } */ {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      path.join(__dirname, 'src/settings'),
      'node_modules',
    ],
  },
};
