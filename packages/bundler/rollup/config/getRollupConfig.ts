import * as chalk from 'chalk'
import * as path from 'path'
import * as acornJSX from 'acorn-jsx'

import babelPlugin from '@rollup/plugin-babel'
import commonJSPlugin from '@rollup/plugin-commonjs'
import jsonPlugin from '@rollup/plugin-json'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import replacePlugin from '@rollup/plugin-replace'
import { RollupOptions} from 'rollup'

import { SCRIPT_EXTENSIONS } from '../../../constants'
import createDependencyManager from './createDependencyManager'
import getRollupEnv from './getRollupEnv'

let cache

// This can be async  if needed for dynamic loading of plugins/library stuff
export default function getRollupConfig(options) : RollupOptions {
    const {
        banner,
        env,
        format,
        input,
        output,
        packageJSON: { dependencies, name, version },
        paths,
        sourcemap,
        target,
    } = options

    const manageDependency = createDependencyManager({ dependencies, input })

    const rollupConfig = {
        acornInjectPlugins: [acornJSX()],
        cache,
        external(source, importer) {
            return manageDependency(source, importer)
        },
        input,
        onwarn(warning) {
            const { code, loc, frame, message } = warning
            let loggedMessage = ` ${message} [${code}]`
            if (loc) {
                loggedMessage += `\n at ${loc.file} (${loc.line}:${loc.column})`
                if (frame) {
                    loggedMessage += `\n ${frame}`
                }
            }
            return console.error(chalk.red(loggedMessage))
        },
        output: {
            file: path.join(paths.root, output),
            format,
            name,
            sourcemap
        },
        plugins: [
            nodeResolvePlugin({ extensions: SCRIPT_EXTENSIONS }),
            commonJSPlugin({ include: /node_modules/ }),
            replacePlugin(getRollupEnv({ env, format, name, target, version })),
            jsonPlugin(),
            babelPlugin({
                // Inline Babel Helpers when not bundling for libraries
                babelHelpers: format === 'umd' ? 'bundled' : 'runtime',
                // Pass information about the build target and format to Babel to use with preset-env
                envName: process.env.NODE_ENV ? `${process.env.NODE_ENV}-${target}-${format}` : `${target}-${format}`,
                // Don't transpile external code
                exclude: ['node_modules/**', '**/*.json'],
                // Override the default extensions to include typescript sources so we can post process them with babel.
                extensions: SCRIPT_EXTENSIONS,
                // Do not perform extensive tests when running in our own test suite
                skipPreflightCheck: process.env.NODE_ENV === 'test',
            })
        ]
    }

    // Allow user overrides of the generated config
    if (options.rollup) {
        return options.rollup(rollupConfig, options)
    }

    return rollupConfig
}