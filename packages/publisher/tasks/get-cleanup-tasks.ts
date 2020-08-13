import execa from 'execa'
import { removeDir } from 'fs-extra'

export default function getCleanupTasks(projectConfig) {
    const tasks = [{
        task: () => removeDir('node_modules'),
        title: 'Cleanup Dependencies'
    }, {
        enabled: () => projectConfig.useYarn === true,
        task: () => execa('yarn', ['install', '--frozen-lockfile', '--production=false']),
        title: 'Installing dependencies with Yarn'
    }, {
        enabled: () => projectConfig.useYarn === false,
        task: () => execa('npm', ['install', '--no-package-lock', '--no-production', '--engine-strict'])
    }]
    return tasks
}