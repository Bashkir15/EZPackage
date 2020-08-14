import { CliArguments, ProjectConfig } from '../types/shared'

export default function parseCommandContext(context: CliArguments, passedConfig: ProjectConfig): ProjectConfig {
    const config = passedConfig
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
    if (configPath) config.paths.config = context.configPath
    if (outputPath) config.paths.output = context.outputPath
    if (rootPath) config.paths.root = context.rootPath

    return {
        ...config,
        ...cliOptions
    }
}