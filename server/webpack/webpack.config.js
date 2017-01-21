var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var HasteMap = require('jest-haste-map');
const _ = require('lodash');

module.exports = (new HasteMap({
    "cacheDirectory": "/var/folders/0t/wqk3jxb923189cp81s6jd8m40000gn/T/jest",
    "extensions": [
      "snap",
      "js",
      "json",
      "jsx",
      "node"
    ],
    "ignorePattern": /SOMECOMPLEXPATTERN/,
    "maxWorkers": 7,
    "mocksPattern": "__mocks__",
    "name": "-Users-flegall-code-github-monorepo-fullstack-starter",
    "platforms": [
      "ios",
      "android"
    ],
    "providesModuleNodeModules": [],
    "resetCache": false,
    "retainAllFiles": false,
    "roots": [
      "/Users/flegall/code/github/monorepo-fullstack-starter"
    ],
    "useWatchman": true,
}).build().then((result) => {
    console.log(JSON.stringify(result.moduleMap.getModule('server.start'), null, 2));
    return {
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
}));
