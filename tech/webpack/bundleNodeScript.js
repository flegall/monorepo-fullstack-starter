// @flow
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const getFileSize = require('filesize');

const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HasteMapWebpackResolver = require('haste-map-webpack-resolver');

const rootPath = path.resolve(__dirname, '../..');
const hasteMapWebpackResolver = new HasteMapWebpackResolver({
    rootPath,
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
const shortBundleDir = path.relative(rootPath, bundleDir)

var compiler = webpack({
    context: rootPath,
    entry: mainFile,
    output: {
        path: bundleDir,
        filename: bundleFileName,
    },
    devtool: 'inline-sourcemap',
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
                            plugins: [
                                "syntax-trailing-function-commas",
                                "transform-exponentiation-operator",
                                "transform-async-to-generator",
                            ],
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
        new ProgressBarPlugin(),
        hasteMapWebpackResolver,

        // Ensures the any-promise module is NEVER resolved as it uses
        // dynamical require() calls.
        new webpack.NormalModuleReplacementPlugin(/^any\-promise$/, 'promise-monofill'),
    ],
});

compiler.run(function(err, stats) {
    if (err) {
        throw err;
    } else {
        if (stats.compilation.errors.length > 0) {
            console.log(`${shortBundleDir} ${mainFileLocal} failed to bundle`, {
                errors: stats.compilation.errors,
                warnings: stats.compilation.warnings,
            });
            process.exit(1);
        }

        const fileStats = fs.statSync(bundleFile);
        const fileSize = getFileSize(fileStats.size);
        console.log(`${shortBundleDir} ${mainFileLocal} bundled in ${bundleFileLocal}: ${fileSize}`, {
            errors: stats.compilation.errors,
            warnings: stats.compilation.warnings,
        });
    }
});
