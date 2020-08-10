import * as chalk from 'chalk'
import { RollupWarning } from 'rollup'

let cache

// This can be async  if needed for dynamic loading of plugins/library stuff
export default function getRollupConfig(options) {
    const {
        banner,
        env,
        format,
        input,
        name,
        output,
        packageJSON,
        paths,
        target,
        version
    } = options

    const rollupConfig = {
        // This should be populated with acornJSX when a user is using jsx
        acornInjectPlugins: [],
        cache,
        external(dependency, importer) {},
        input,
        onwarn(warning: RollupWarning) {
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
        output: {},
        plugins: []
    }

    // Allow user overrides of the generated config
    if (options.rollup) {
        return options.rollup(rollupConfig, options)
    }

    return rollupConfig
}