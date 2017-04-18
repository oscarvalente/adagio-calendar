const path = require('path');
const ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin');

const config = {
    context: path.join(__dirname, 'app'),
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/,
                query: {
                    plugins: ['transform-decorators-legacy'],
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/
            },
            {
                test: /\.json$/, loader: 'json-loader', exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                loaders: ['to-string-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?title=assets/[title].[hash].[ext]'
            }
        ]
    },
    plugins: [
        new ElectronConnectWebpackPlugin({
            path: __dirname
        })
    ],
    devtool: 'source-map'
};

module.exports = config;