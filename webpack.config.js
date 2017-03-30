const config = {
    context: __dirname + '/app',
    entry: './app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/,
                query: {
                    plugins: ['transform-decorators-legacy']
                }
            }, {
                test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/
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
    }
};

config.devtool = 'source-map';

module.exports = config;