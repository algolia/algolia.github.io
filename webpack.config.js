const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/js/app.js',
    serviceWorker: './src/js/serviceWorker.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
