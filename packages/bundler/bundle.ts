import { BundlerTask } from '../types/bundler'
import { ProjectConfig } from '../types/shared'

import { createRollupTasks, executeRollupCompile, executeRollupWatch } from './rollup'

export async function bundle(projectConfig: ProjectConfig) {
    const { packageJSON: { name, version }, watch } = projectConfig

    // This could just be the task title? 
    console.log(`${watch ? 'Watching' : 'Building'} ${name}-${version}`)
    const tasks: BundlerTask[] = createRollupTasks(projectConfig)

    if (watch) {
        const watcher = executeRollupWatch(tasks.map(({ rollupConfig }) => rollupConfig))
        // Potentially convert this to an observable 
        watcher.on('event', event => {
            if (event.code === 'ERROR') {
                console.error(event.error)
            } else if (event.code === 'BUNDLE_END') {
                console.log('Bundle Changes Built')
            }
        })
    } else {
        for (const { rollupConfig, taskInfo } of tasks) {
            await executeRollupCompile(rollupConfig)
        }
    }
}