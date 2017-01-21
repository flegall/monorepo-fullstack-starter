var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var HasteMap = require('jest-haste-map');
const _ = require('lodash');

new HasteMap({
    extensions: ['js', 'json'],
    ignorePattern: /VERYCOMPLEX_IGNORE_PATTERN/,
    roots: [path.resolve(__dirname, '../..')],
    maxWorkers: 1,
    name: 'haste-map-test',
    platforms: ['ios', 'android'],
    resetCache: false,
    useWatchman: true,
}).build().then((result) => {
    // console.log(JSON.stringify(result.moduleMap, null, 2));
});

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: './main-server.js',
    output: {
        path: './dist',
        filename: 'server.bundle.js',
    },
    devtool: 'sourcemap',
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['node6']
                        },
                    }
                ]
            }
        ],
    },
    plugins: [
        new webpack.BannerPlugin(
            {
                banner: 'require("source-map-support").install();',
                raw: true,
                entryOnly: false,
            }
        ),
        new ProgressBarPlugin(),
    ],
};
