var path = require('path');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: './main-server.js',
    output: {
        path: './dist',
        filename: 'server.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        },
                    }
                ]
            }
        ],
    },
};
