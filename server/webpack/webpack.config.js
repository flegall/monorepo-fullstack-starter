const _ = require('lodash');
const path = require('path');

const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HasteMapWebpackResolver = require('haste-map-webpack-resolver');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: './main.js',
    output: {
        path: './dist',
        filename: 'server.bundle.js',
    },
    devtool: 'sourcemap',
    target: 'node',
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
    resolve: {
        plugins: [new HasteMapWebpackResolver({
            rootPath: path.resolve(__dirname, '../..'),
        })],
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
