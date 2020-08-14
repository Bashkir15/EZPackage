import inquirer from 'inquirer'
import path from 'path'
import { ProjectConfig } from '../types'

export async function bundlerUI(projectConfig: ProjectConfig): Promise<ProjectConfig> {
    const prompts = [[{
        message: 'Where would you like to bundle these too?',
        name: 'outputPath',
        type: 'input'
    }]]

    const { outputPath } = await inquirer.prompt(prompts)
    const resolvedOutputPath = path.resolve(projectConfig.paths.root, outputPath)

    return {
        ...projectConfig,
        paths: {
            ...projectConfig.paths,
            output: resolvedOutputPath
        }
    }
}