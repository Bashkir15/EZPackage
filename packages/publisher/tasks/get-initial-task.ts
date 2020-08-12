import { checkRegistryConnection, isExternalNPMRegistry } from '../npm'

export default function getInitialTasks(projectConfig) {
    const { packageJSON } = projectConfig
    const isExternalRegistry = isExternalNPMRegistry(packageJSON)
    
    const tasks = [{
        task: () => checkRegistryConnection(),
        title: 'Pinging npm registry',
        skip: () => packageJSON.private || isExternalRegistry
    }]
}