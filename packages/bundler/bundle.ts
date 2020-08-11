import { createRollupTasks, executeRollupCompile, executeRollupWatch } from './rollup'

export default async function bundle(projectConfig) {
    const { name, version, watch } = projectConfig

    // This could just be the task title? 
    console.log(`${watch ? 'Watching' : 'Building'} ${name}-${version}`)
    const tasks = createRollupTasks(projectConfig)

    if (watch) {
        const watcher = executeRollupWatch(tasks)
        // Potentially convert this to an observable 
        watcher.on('event', event => {
            if (event.code === 'ERROR') {
                console.error(event.error)
            } else if (event.code === 'BUNDLE_END') {
                console.log('Bundle Changes Built')
            }
        })
    } else {
        for (const task of tasks) {
            await executeRollupCompile(task)
        }
    }
}