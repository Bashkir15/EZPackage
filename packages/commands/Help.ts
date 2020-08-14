import commandLineUsage from 'command-line-usage'

import { Command, CommandResult, ProjectConfig } from '../types'
import { GLOBAL_CLI_ARGS } from '../constants'

export class HelpCommand implements Command {
    aliases = []
    args = [{
        defaultOption: true,
        description: 'The command to display help for',
        name: 'command'
    }]
    commands: Map<string, Command> = new Map()
    description = 'Shows this help message or help for a specific command'
    name = 'help'

    constructor(commands: Map<string, Command>) {
        this.commands = commands
    }

    generateGeneralUsage(): string {
        return commandLineUsage([{
            content: [...this.commands.values()].map(command => ({
                name: command.name,
                summary: command.description
            })),
            header: 'Available Commands'
        }, {
            header: 'Global Options',
            optionList: GLOBAL_CLI_ARGS
        }, {
            content: `Run 'ezp help <command>' for help with a specific command`
        }])
    }

    async run (projectConfig: ProjectConfig): CommandResult {
        console.log(this.generateGeneralUsage())
        return { successful: true }
    }
}