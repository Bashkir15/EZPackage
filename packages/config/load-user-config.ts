import { cosmiconfig } from 'cosmiconfig'

import { ProjectConfig } from '../types'

import { CONFIG_FILE_LOCATIONS } from '../constants'

export default async function loadUserConfig(paths: { config?: string, root: string }): Promise<ProjectConfig> {
    const searchPlaces = paths.config ? [paths.config] : CONFIG_FILE_LOCATIONS
    const explorer = cosmiconfig('ez', {
        searchPlaces,
        stopDir: paths.root
    })
    const { config } = (await explorer.search(paths.root)) || {}
    return config
}