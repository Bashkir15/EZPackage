import { Command, CommandResult, ProjectConfig } from '../types'

export class PublishCommand implements Command {
    aliases = []
    args = [{
        description: 'Whether to only preview what a publish would do',
        name: 'preview',
        type: Boolean
    }, {
        description: 'The type of release to do',
        name: 'releaseType',
        type: String
    }, {
        description: 'Build the files before publishing',
        name: 'runBuild',
        type: Boolean
    }, {
        description: 'Whether to run tests before publishing',
        name: 'runTest',
        type: Boolean
    }, {
        description: 'The tag to publish',
        name: 'tag',
        type: String
    }, {
        description: 'The test file to run with node when runTest is true',
        name: 'testScript',
        type: String
    }]

    description = 'Publish a package to npm'
    name = 'publish'

    async run(projectConfig: ProjectConfig): CommandResult {
        let passedConfig = projectConfig

        const { publish } = await import('../publish/publish')
        if (projectConfig.interactive) {
            const { publishUI } = await import('../publish/publish-ui')
            passedConfig = await publishUI(projectConfig)
        }

        await publish(passedConfig)
        return { successful: true }
    }
}