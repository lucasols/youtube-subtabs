const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const express = require('express');
const portfinder = require('portfinder');

const config = require('../webpack/webpack.settingsApp.dev');
const path = require('path');

portfinder.basePort = 5000;
const staticDir = 'dist/static';

const options = {
  publicPath: config.output.publicPath,
  contentBase: './public',
  watchContentBase: true,
  hot: true,
  host: 'localhost',
  historyApiFallback: true,
  quiet: true,
  overlay: true,
  stats: {
    colors: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  },
  setup(app) {
    app.use(
      '/static',
      express.static(path.join(__dirname, `../${staticDir}`)),
    );
  },
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

portfinder.getPort((err, port) => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Dev server listening on port ${port}`);
  });
});
