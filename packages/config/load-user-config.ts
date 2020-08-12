import { cosmiconfig } from 'cosmiconfig'

import { ProjectConfig } from '../types/shared'

export default async function loadUserConfig(paths): Promise<ProjectConfig> {
    const searchPlaces = ['.ez-config.json', '.ez-config.js', 'package.json']
    if (paths.configPath) searchPlaces.unshift(paths.configPath)
    
    const explorer = cosmiconfig('ez', {
        searchPlaces,
        stopDir: paths.root
    })
    const { config } = (await explorer.search(paths.root)) || {}
    return config
}