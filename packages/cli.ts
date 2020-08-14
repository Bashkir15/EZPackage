import commandLineArgs, { ArgDescriptor } from 'command-line-args'
import commandLineCommands from 'command-line-commands'

import { Command } from './types/shared'

import { BuildCommand } from './commands/Build'
import { PublishCommand } from './commands/Publish'
import { getConfig } from './config'
import { GLOBAL_CLI_ARGS } from './constants'

function mergeArguments(argumentsList: ArgDescriptor[][]): ArgDescriptor[] {
    const argsByName = new Map<string, ArgDescriptor>()
    for (const args of argumentsList) {
        for (const arg of args) {
            argsByName.set(arg.name, { ...(argsByName.get(arg.name)), ...arg })
        }
    }
    return Array.from(argsByName)
}

export class EZCli {
    args: string[]
    commands: Map<string, Command> = new Map()

    constructor(args: string[]) {
        this.args = args
        this.addCommand(new BuildCommand())
        this.addCommand(new PublishCommand())
    }

    addCommand(command: Command) {
        this.commands.set(command.name, command)
        command.aliases.forEach(alias => {
            this.commands.set(alias, command)
        })
    }

    async run() {
        const commandNames = Array.from(this.commands.keys())
        let parsedArgs

        try {
            parsedArgs = commandLineCommands(commandNames, this.args)
        } catch (error) {
            if (error.name === 'INVALID_COMMAND') {
                if (error.command) {
                    console.error(`${error.command} is not an available command`)
                    // TODO: Run help command
                }
                throw error
            }
        }

        const { argv: commandArgs, command: commandName } = parsedArgs
        const command = this.commands.get(commandName)
        const commandDefinitions = mergeArguments([command.args, GLOBAL_CLI_ARGS])
        const commandOptions = commandLineArgs(commandDefinitions, { argv: commandArgs })
        const config = await getConfig(commandOptions)
        
        if (commandOptions['help']) {
            // TODO: Return help command
        }

        return command.run(config)
    }
}