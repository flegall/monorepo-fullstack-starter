const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HasteMap = require('jest-haste-map');
const _ = require('lodash');


const rootDir = path.resolve(__dirname, '../..');
const hasteMap = new HasteMap({
    "extensions": [
      "snap",
      "js",
      "json",
      "jsx",
      "node"
    ],
    "ignorePattern": /SOME_COMPLEX_UNLIKELY_TO_HAPPEN_PATTERN/,
    "maxWorkers": 7,
    "name": rootDir.replace(/[\/\\]/g, '_'),
    "platforms": [
      "ios",
      "android"
    ],
    "providesModuleNodeModules": [],
    "resetCache": false,
    "retainAllFiles": false,
    "roots": [
      rootDir,
    ],
    "useWatchman": true,
}).build();

const ProvidesModuleResolver = {
    apply: function(resolver) {
        resolver.plugin('module', function(request, callback) {
            hasteMap.then((hasteMap) => {
                const module = hasteMap.moduleMap.getModule(request.request);
                if (module) {
                    callback(null, {
                        path: module,
                        query: request.query,
                        file: true,
                        resolved: true
                    });
                } else {
                    callback();
                }
            });
        });
    }
};

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: './main.js',
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
    resolve: {
        plugins: [ProvidesModuleResolver],
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
