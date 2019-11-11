const path = require('path');
const appConfig = require('../app.config.json');

const fileLoaderOptions = {
  outputPath: (url, resourcePath) =>
  // if (/fonts\\[^\n\r\\]+?$/.test(resourcePath)) {
  //   return `fonts/${url}`;
  // }

    `images/${url}`,
  name: '[name]-[contenthash:8].[ext]',
};

const googleFonts = appConfig.html.fonts
  ? appConfig.html.fonts
    .map(
      font =>
        `${font.family.replace(' ', '+')}${
          font.weights ? `:${font.weights.join(',')}` : ''
        }`,
    )
    .join('|')
  : false;

module.exports = /** @type { import('webpack').Configuration } */ {
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href'],
              minimize: true,
            },
          },
          {
            loader: 'ejs-html-loader',
            options: {
              appConfig,
              googleFonts,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          ...fileLoaderOptions,
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico|woff|woff2)$/i,
        loader: 'file-loader',
        options: fileLoaderOptions,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
  },
};
