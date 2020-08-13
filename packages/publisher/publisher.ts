import Listr from 'listr'

import { bundle } from '../bundler'
import { gitPush, hasUpstream } from './git'
import { getPackagePublishArguments, publishPackage } from './npm'
import { getCleanupTasks, getGitTasks, getInitialTasks, getTestTasks } from './tasks'
import execa from 'execa'

export default function createPublisher(projectConfig) {
    const { packageJSON, packageManager, preview, releaseType, runCleanup, runBuild, runPublish, runTests, useYarn } = projectConfig
    
    let publishStatus = 'UNKNOWN'

    const publisher = new Listr([{
        enabled: () => runPublish,
        task: () => getInitialTasks(projectConfig),
        title: 'Initial checks/tasks'
    }, {
        task: () => getGitTasks(projectConfig),
        title: 'Git'
    }])

    if (runCleanup) {
        publisher.add(getCleanupTasks(projectConfig))
    }

    if (runTests) {
        publisher.add(getTestTasks(projectConfig))
    }

    publisher.add([{
        enabled: () => useYarn,
        skip: () => {
            if (preview) {
                return `[Preview] command not executed: yarn version --new-version ${releaseType}`
            }
        },
        task: () => execa('yarn', ['version', '--new-version', releaseType])
    }, {
        enabled: () => !useYarn,
        skip: () => {
            if (preview) {
                return `[Preview] command not executed: npm version ${releaseType}`
            }
        },
        task: () => execa('npm', ['version', releaseType])
    }])

    if (runPublish) {
        publisher.add([{
            skip: () => {
                if (preview) {
                    const args = getPackagePublishArguments(projectConfig)
                    return `[Preview] command not executed: ${packageManager} ${args.join(' ')}`
                }
            },
            task: async () => {
                let hasError = false
                try {
                    await publishPackage(packageManager, projectConfig)
                } catch (err) {
                    hasError = true
                } finally {
                    publishStatus = hasError ? 'FAILED' : 'SUCCESS'
                }
            },
            title: `Publishing package usage ${packageManager}`
        }])
    } else {
        publishStatus = 'SUCCESS'
    }

    publisher.add({
        skip: async () => {
            const hasUpstreamBranch = await hasUpstream()
            if (!hasUpstreamBranch) {
                return 'Upstream branch not found. Not pushing'
            }

            if (preview) {
                return '[Preview] comand not executed: git push --follow-tags'
            }

            if (publishStatus === 'FAILED' && runPublish) {
                return `Couldn't publish package to npm; not pushing`
            }
        },
        task: () => gitPush(),
        title: 'Pushing tags to git'
    })

    return publisher
}