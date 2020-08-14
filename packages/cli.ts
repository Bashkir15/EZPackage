import commandLineArgs, { ArgDescriptor } from 'command-line-args'
import commandLineCommands, { ParsedCommand } from 'command-line-commands'

import { CliConfig, Command } from './types'

import { BuildCommand } from './commands/Build'
import { HelpCommand } from './commands/Help'
import { PublishCommand } from './commands/Publish'
import { getDefaultConfig, getConfig } from './config'
import { GLOBAL_CLI_ARGS } from './constants'

import ownPackageJSON from '../package.json'

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
        this.addCommand(new HelpCommand(this.commands))
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
        const helpCommand = this.commands.get('help')
        let parsedArgs: ParsedCommand

        try {
            parsedArgs = commandLineCommands(commandNames, this.args)
        } catch (error) {
            if (error.name === 'INVALID_COMMAND') {
                if (error.command) {
                    console.error(`${error.command} is not an available command`)
                    return helpCommand.run(getDefaultConfig())
                }
                throw error
            }
        }

        const { argv: commandArgs, command: commandName } = parsedArgs
        const command = this.commands.get(commandName)
        const commandDefinitions: ArgDescriptor[] = mergeArguments([command.args, GLOBAL_CLI_ARGS])
        const commandOptions: CliConfig = commandLineArgs(commandDefinitions, { argv: commandArgs })
        
        const config = await getConfig(commandOptions, ownPackageJSON.engines)
        
        if (commandOptions['help']) {
            return helpCommand.run(config, { command: commandName })
        }

        return command.run(config)
    }
}