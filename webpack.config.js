const webpack = require('webpack');

const client = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      test: /\.js?/,
    }]
  }
};

module.exports = client;
