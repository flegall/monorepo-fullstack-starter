// @flow
const path = require('path');
const yargs = require('yargs');

const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HasteMapWebpackResolver = require('haste-map-webpack-resolver');

const hasteMapWebpackResolver = new HasteMapWebpackResolver({
    rootPath: path.resolve(__dirname, '../../..'),
});

const argv = yargs
    .usage('Usage: $0 [mainFile] [bundleFile]')
    .demand(2, 'You must provide a mainFile and a target bundleFile')
    .example('$0 ./main.js ./build/main.js',
        'Generate a ./build/main.js from the ./main.js')
    .epilog('Builds a node script')
    .help()
    .strict()
    .argv;

const mainFileLocal = argv._[0];
const bundleFileLocal = argv._[1];

const mainFile = path.resolve(process.cwd(), mainFileLocal);
const bundleFile = path.resolve(process.cwd(), bundleFileLocal);

const bundleDir = path.dirname(bundleFile);
const bundleFileName = path.basename(bundleFile);

var compiler = webpack({
    entry: mainFile,
    output: {
        path: bundleDir,
        filename: bundleFileName,
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
        plugins: [hasteMapWebpackResolver.resolver],
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
        hasteMapWebpackResolver,
    ],
});

compiler.run(function(err, stats) {
    if (err) {
        throw err;
    } else {
        if (stats.compilation.errors.length > 0) {
            console.log(`Node script ${mainFileLocal} failed to bundle`, {
                errors: stats.compilation.errors,
                warnings: stats.compilation.warnings,
            });
            process.exit(1);
        }
        console.log(`Node script ${mainFileLocal} bundled in ${bundleFileLocal}`, {
            errors: stats.compilation.errors,
            warnings: stats.compilation.warnings,
        });
    }
});
