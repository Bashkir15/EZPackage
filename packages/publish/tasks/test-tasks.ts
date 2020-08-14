import execa from 'execa'
import { ListrTask } from 'listr'

import { ProjectConfig } from '../../types'

export default function getTestTasks(projectConfig: ProjectConfig): ListrTask[] {
    const { testCommand, useYarn } = projectConfig
    return [{
        enabled: () => !useYarn,
        task: () => execa('npm', ['run', testCommand]),
        title: 'Running Project tests with NPM'
    }, {
        enabled: () => useYarn,
        task: () => execa('yarn', ['run', testCommand]),
        title: 'Running Project tests with Yarn'
    }]
}