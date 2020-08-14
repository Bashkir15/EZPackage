import Listr from 'listr'

import { ProjectConfig } from '../../types'
import { isRemoteHistoryClean, isWorkingTreeClean } from '../git'

export default function getGitTasks(projectConfig: ProjectConfig): Listr {
    const tasks = [{
        task: async () => {
            const workingTreeClean = await isWorkingTreeClean()
            if (!workingTreeClean) {
                throw new Error('Unclean working tree. Commit or stash changes first')
            }
        },
        title: 'Verify current working tree is clean'
    }, {
        task: async () => {
            const remoteHistoryClean = await isRemoteHistoryClean()
            if (!remoteHistoryClean) {
                throw new Error('Remote history differs. Please pull changes')
            }
        },
        title: 'Verify the current remote history is clean'
    }]

    return new Listr(tasks)
}
