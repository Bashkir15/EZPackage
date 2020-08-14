import path from 'path'
import pkgDir from 'pkg-dir'

import { CliConfig, ProjectConfig } from '../types'

import getDefaultConfig from './defaults'
import loadUserConfig from './load-user-config'
import parseCommandContext from './parse-command-context'
import parsePackageJSON from './parse-package'

export default async function getConfig(cliOptions: CliConfig): Promise<ProjectConfig> {
    const rootDir = cliOptions.rootPath 
        ? path.resolve(cliOptions.rootPath) 
        : (await pkgDir())
    
    const baseConfig = parseCommandContext(cliOptions, getDefaultConfig(rootDir))

    const [packageJSON, userConfig] = await Promise.all([
        parsePackageJSON(rootDir),
        loadUserConfig(baseConfig.paths)
    ])

    const config = { ...baseConfig, ...packageJSON }
    return userConfig ? { ...config, ...userConfig } : config
}