import { ListrTask } from 'listr'
import execa from 'execa'

import { ProjectConfig } from '../../types'

export default function getVersionTasks(projectConfig: ProjectConfig): ListrTask[] {
    const { releaseType, runPublish, useYarn } = projectConfig
    return [{
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
    }]
}