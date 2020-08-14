import Listr from 'listr'

import { ProjectConfig } from '../types'
import { getGitTasks, getInitialTasks } from './tasks'

export async function publish(projectConfig: ProjectConfig) {
    const { runBuild, runCleanup, runPublish } = projectConfig

    const tasks = new Listr([{
        enabled: () => runPublish,
        task: () => getInitialTasks(projectConfig, {}),
        title: 'Running Initial Checks'
    }, {
        task: () => getGitTasks(projectConfig),
        title: 'Git Checks'
    }])

    if (runCleanup) {
        const { getCleanupTasks } = await import('./tasks/cleanup-tasks')
        tasks.add(getCleanupTasks(projectConfig))
    }
    
    if (runBuild) {
        const { bundle } = await import('../bundler/bundle')
        tasks.add({
            task: () => bundle(projectConfig),
            title: 'Building project bundle'
        })
    }

    await tasks.run()
}