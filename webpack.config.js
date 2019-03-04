const webpack = require('webpack');

const client = {
  entry: ['@babel/polyfill', './src/app.js'],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js?/,
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = client;
