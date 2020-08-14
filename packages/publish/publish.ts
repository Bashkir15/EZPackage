import Listr from 'listr'
import execa from 'execa'

import { ProjectConfig } from '../types'
import { PUBLISH_STATUSES } from '../constants'
import { hasUpstreamBranch } from './git'
import { publishPackage } from './npm'
import { getGitTasks, getInitialTasks, getTestTasks, getVersionTasks } from './tasks'


export async function publish(projectConfig: ProjectConfig) {
    const { releaseType, runBuild, runCleanup, runPublish, runTests, useYarn } = projectConfig
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

    if (runTests) {
        tasks.add(getTestTasks(projectConfig))
    }

    tasks.add(getVersionTasks(projectConfig))

    if (runPublish) {
        tasks.add([{
            task: async () => {
                let hasError = false
                try {
                    await publishPackage(useYarn ? 'yarn' : 'npm')
                } catch (publishError) {
                    hasError = true
                    console.error(`Error publishing package:\n${publishError.message}`)
                } finally {
                    publishStatus = hasError ? PUBLISH_STATUSES.Failed : PUBLISH_STATUSES.Success
                }
            },
            title: `Publishing package using ${useYarn ? 'yarn' : 'npm'}`
        }])
        
    } else {
        publishStatus = PUBLISH_STATUSES.Success
    }

    tasks.add({
        skip: async () => {
            const hasUpstream = await hasUpstreamBranch()
            if (!hasUpstream) {
                console.log('Upstream branch not found. Not pushing to Github')
                return true
            }
            if (!runPublish) {
                console.log(`[Preview] Command not executed: git push --follow-tags`)
                return true
            }
            if (publishStatus === PUBLISH_STATUSES.Failed && runPublish) {
                console.log(`Couldn't publish package to npm. Not pushing to Github`)
                return true
            }
            return false
        },
        task: () => execa('git', ['push', '--follow-tags']),
        title: 'Pushing tags and code to Github'
    })

    await tasks.run()
}