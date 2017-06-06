
var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: {
        app: './src/js/app.js',
        serviceWorker: './src/js/serviceWorker.js'
    },
    output: {
        path: __dirname,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader?presets[]=es2015'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                'NODE_ENV': '"production"'
            }
        })
    ]
};
