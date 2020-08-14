import Listr from 'listr'

import { ProjectConfig } from '../types'
import { getGitTasks, getInitialTasks } from './tasks'

export async function publish(projectConfig: ProjectConfig) {
    const { runPublish } = projectConfig

    const tasks = new Listr([{
        enabled: () => runPublish,
        task: () => getInitialTasks(projectConfig, {}),
        title: 'Running Initial Checks'
    }, {
        task: () => getGitTasks(projectConfig),
        title: 'Git Checks'
    }])

    await tasks.run()
}