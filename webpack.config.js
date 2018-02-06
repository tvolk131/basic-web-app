const webpack = require('webpack');
const path = require('path');
const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VENDOR_LIBS = [
  'axios',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-router-redux',
  'react-redux',
  'redux',
  'redux-socket.io',
  'material-ui',
  'socket.io-client'
];

module.exports = {
  entry: {
    bundle: `${SRC_DIR}/index.jsx`,
    vendor: VENDOR_LIBS
  },
  output: {
    filename: '[name].js',
    path: DIST_DIR
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new UglifyJSPlugin({sourceMap: true})
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',      
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader' // Allows css in React
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        }
      }
    ]
  }
};
