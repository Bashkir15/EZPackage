import getDefaultConfig from './defaults'
import loadUserConfig from './load-user-config'
import parsePackageJSON from './parse-package'

export default async function getConfig(context) {
    let config = getDefaultConfig(context)
    const packageJSON = await parsePackageJSON(config.paths.root)
    config = { ...config, ...packageJSON }

    const userConfig = await loadUserConfig(config.paths)
    // Need to actually merge these.
    if (userConfig) {
        config = {
            ...config,
            ...userConfig
        }
    }

    // Need to modify config based on potential command line args as well
    return config
}