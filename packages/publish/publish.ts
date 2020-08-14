import Listr from 'listr'
import execa from 'execa'

import { ProjectConfig } from '../types'
import { PUBLISH_STATUSES } from '../constants'
import { getGitTasks, getInitialTasks } from './tasks'


export async function publish(projectConfig: ProjectConfig) {
    const { releaseType, runBuild, runCleanup, runPublish, useYarn } = projectConfig
    let publishStatus = PUBLISH_STATUSES.Unknown

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

    tasks.add([{
        enabled: () => useYarn,
        skip: () => {
            if (!runPublish) {
                return `[Preview] Command not executed: yarn version --new-version ${releaseType}`
            }
        },
        task: () => execa('yarn', ['version', '--new-version', releaseType]),
        title: 'Bumping package version with Yarn'
    }, {
        enabled: () => !useYarn,
        skip: () => {
            if (!runPublish) {
                return `[Preview] Command not executed: npm version ${releaseType}`
            }
        },
        task: () => execa('npm', ['version', releaseType]),
        title: 'Bumping package version with NPM'
    }])
    
    if (runPublish) {
        // TODO Import the publish tasks dynamically
        
    } else {
        publishStatus = PUBLISH_STATUSES.Success
    }

    await tasks.run()
}