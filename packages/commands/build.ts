import { Command } from '../types/shared'

export class BuildCommand implements Command {
    aliases = []
    args = [{
        description: 'Browser entry point',
        name: 'browserEntry',
        type: String
    }, {
        desription: 'Cli entry point',
        name: 'cliEntry',
        type: String
    }, {
        description: 'Library entry point',
        name: 'libraryEntry',
        type: String
    }, {
        description: 'Node entry point',
        name: 'nodeEntry',
        type: String
    }, {
        description: 'Whether to execute output binaries after build',
        name: 'exec',
        type: Boolean
    }, {
        description: 'Whether to watch the project to bundle on changes',
        name: 'watch',
        type: Boolean
    }]
    description = 'Builds a project'
    name = 'build'

    async run(projectConfig) {
        const { bundle } = await import('../bundler/bundle')
        return bundle(projectConfig)
    }
}
