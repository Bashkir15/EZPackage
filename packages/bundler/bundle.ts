import { ProjectConfig } from '../types'

import { createRollupTasks, executeRollupCompile, executeRollupWatch, getBundleOutputs } from './rollup'

import getPackageBanner from './get-package-banner'

export async function bundle(projectConfig: ProjectConfig) {
    const { packageJSON, paths, watch } = projectConfig
    const bundleOutputs = getBundleOutputs(paths.output, packageJSON)
    const banner = getPackageBanner(packageJSON)
    const tasks = createRollupTasks(projectConfig, { banner, output: bundleOutputs})

    if (watch) {
        const watcher = executeRollupWatch(tasks)
        watcher.on('event', watchEvent => {

        })
    } else {
        for (const task of tasks) {
            await executeRollupCompile(task)
        }
    }

    return { successful: true }
}
