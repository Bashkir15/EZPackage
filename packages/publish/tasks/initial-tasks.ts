import Listr from 'listr'
import execa from 'execa'
import promiseTimeout from 'p-timeout'


import { ProjectConfig } from '../../types'
import { NPM_REGISTRY_TIMEOUT } from '../../constants'


export default function getInitialTasks(projectConfig: ProjectConfig, publishContext): Listr {
    const { env, packageJSON, useExternalRegistry } = projectConfig

    const tasks = [{
        skip: () => packageJSON.private || useExternalRegistry,
        task: async () => promiseTimeout((async () => {
            try {
                await execa('npm', ['ping'])
                return true
            } catch (err) {
                throw new Error('Connection to npm registry failed')
            }
        })(), NPM_REGISTRY_TIMEOUT, 'Connection to npm registry timed out'),
        title: 'Checking connection to npm registry'
    }, {
        task: async () => {
            try {
                await execa('git', ['ls-remote', 'origin', 'HEAD'])
            } catch (err) {
                throw new Error(err.stderr.replace('fatal:', 'Git fatal error:'))
            }
        },
        title: 'Verifying Git Remote is valid'
    }]

    return new Listr(tasks)
}