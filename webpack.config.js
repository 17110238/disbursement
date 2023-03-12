const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const { SourceMapDevToolPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[contenthash:8].bundle.js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    clean: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'disbursement - ui',
      filename: 'index.html',
      template: './public/index.html',
      favicon: './favicon.ico',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_BFF: JSON.stringify('https://localhost:8443'),
      },
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    port: 3000,
    historyApiFallback: true,
    static: path.resolve(__dirname, 'public'),
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const port = devServer.server.address().port;
      console.log(`Server in running on port ${port}!`);
    },
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      helpers: path.resolve(__dirname, 'src/helpers/'),
      assets: path.resolve(__dirname, 'src/assets/'),
      store: path.resolve(__dirname, 'src/store/'),
      services: path.resolve(__dirname, 'src/services/'),
      pages: path.resolve(__dirname, 'src/pages/'),
    },
    fallback: {
      fs: false,
    },
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|ico|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'defaults',
                  debug: false,
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
    ],
  },
};
