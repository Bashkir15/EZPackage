import { Command } from '../types/shared'

export class BuildCommand implements Command {
    aliases = []
    description = 'Builds a project'
    name = 'build'

    async run(projectConfig) {
        const { bundle } = await import('../bundler/bundle')
        return bundle(projectConfig)
    }
}
