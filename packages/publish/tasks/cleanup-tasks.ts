import { ListrTask } from 'listr'
import { removeDir } from 'fs-extra'
import execa from 'execa'
import path from 'path'

import { ProjectConfig } from '../../types'

export function getCleanupTasks(projectConfig: ProjectConfig): ListrTask[] {
    const { hasPackageLock, paths, useYarn } = projectConfig
    return [{
        skip: () => hasPackageLock,
        task: () => removeDir(path.join(paths.root, 'node_modules')),
        title: 'Cleaning up dependencies'
    }, {
        enabled: () => useYarn,
        task: async () => {
            try {
                await execa('yarn', ['install', '--frozen-lockfile', '--production=false']) 
            } catch (err) {
                if (err.stderr.startsWith('error Your lockfile needs to be updated')) {
                    throw new Error('yarn.lock file is outdated. Run yarn, commit the updated lockfile and try again')
                }
                throw err
            }
        },
        title: 'Installing dependencies with yarn'
    }, {
        enabled: () => !useYarn,
        task: () => {
            const args = hasPackageLock ? ['ci'] : ['install', '--no-package-lock', '--no-production']
            return execa('npm', [...args, '--engine-strict'])
        },
        title: 'Installing dependencies with NPM'
    }]
}
