const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const express = require('express');
const portfinder = require('portfinder');

const config = require('../webpack.hot-reload');
const path = require('path');

portfinder.basePort = 5000;
const staticDir = 'dist/settings/static';

const options = {
  publicPath: config.output.publicPath,
  contentBase: './public',
  watchContentBase: true,
  hot: true,
  host: 'localhost',
  historyApiFallback: true,
  quiet: true,
  stats: {
    colors: true, // color is life
    // errorDetails: true,
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
  before(app, server) {
    // This lets us fetch source contents from webpack for the error overlay
    app.use(evalSourceMapMiddleware(server));
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware());
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
