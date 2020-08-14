import { BundlerPackageOutput, BundlerTasks, ProjectConfig } from '../../types'
import { createRollupConfig } from './config'

type BundleConfig = {
    banner: string,
    output: BundlerPackageOutput
}

export default function createRollupTasks(projectConfig: ProjectConfig, bundleConfig: BundleConfig): BundlerTasks {
    const {
        env,
        entries,
        packageJSON: { author, dependencies, name, version },
        paths,
        sourcemap,
        tsConfig,
        watch
    } = projectConfig
    const { banner, output } = bundleConfig

    const base = {
        banner,
        env,
        packageJSON: { author, dependencies, name, version },
        paths,
        sourcemap,
        watch
    }

    let tasks = []

    const formatBasic = key => ({ ...base, input: entries[key], target: key })
    const formatBinary = key => ({ ...base, format: 'cjs', input: entries.cli[key], output: output.binaries[key], target: 'cli' })
    const formatUMD = key => ({ ...base, format: 'umd', input: entries[key], output: output.umd, target: 'library' })
    const formatMain = key => ({ ...formatBasic(key), format: 'cjs', output: output.main })
    const formatModule = key => ({ ...formatBasic(key), format: 'esm', output: output.module })
    const formatBrowser = key => ({ ...formatModule(key), input: entries.browser, output: output.browser })
    const formatTypes = () => ({ ...base, format: 'tsc', input: entries.library, output: output.types, tsConfig })
    
    if (entries.node) {
        if (output.main) {
            tasks.push(formatMain('node'))
        }
        if (output.module) {
            tasks.push(formatModule('node'))
        }
    }

    if (entries.library) {
        if (output.main) {
            tasks.push(formatMain('library'))
        }
        if (output.module) {
            tasks.push(formatModule('library'))
        }
        if (!entries.browser) {
            if (output.umd) {
                tasks.push(formatUMD('library'))
            }
            if (output.types) {
                tasks.push(formatTypes())
            }
        }
    }

    if (entries.browser) {
        if (output.browser) {
            tasks.push(formatBrowser('browser'))
        }
        if (output.umd) {
            tasks.push(formatUMD('browser'))
        }
    }

    if (entries.cli) {
        if (output.binaries) {
            for (const binaryKey of Object.keys(output.binaries)) {
                if (output.binaries[binaryKey]) {
                    tasks.push(formatBinary(binaryKey))
                }
            }
        }
    }

    // Ignore node_modules changes in watch mode
    if (watch) {
        tasks = tasks.reduce((acc, task) => {
            if (task.format !== 'tsc') {
                acc.push({
                    ...task,
                    watch: { exclude: 'node_modules/**' }
                })
            }
            return acc
        }, [])
    }

    return tasks.map(task => createRollupConfig(task))
}