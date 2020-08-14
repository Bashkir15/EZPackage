import { Command } from '../types/shared'

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

    async run (config) {
        
    }
}