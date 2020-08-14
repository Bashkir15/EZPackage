import path from 'path'

import { CliConfig, ProjectConfig } from '../types'

export default function parseCommandContext(context: CliConfig, defaultConfig: ProjectConfig): ProjectConfig {
    const config = defaultConfig
    const {
        browserEntry,
        cliEntry,
        configPath,
        libraryEntry,
        nodeEntry,
        outputPath,
        rootPath,
        ...cliOptions
    } = context

    // Parse for entry points
    if (browserEntry) config.entries.browser = browserEntry
    if (cliEntry) config.entries.cli = cliEntry
    if (libraryEntry) config.entries.library = libraryEntry
    if (nodeEntry) config.entries.node = nodeEntry

    // Parse for paths
    if (configPath) config.paths.config = path.resolve(config.paths.root, context.configPath)
    if (outputPath) config.paths.output = path.resolve(config.paths.root, context.outputPath)

    return {
        ...config,
        ...cliOptions
    }
}