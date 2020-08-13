import Listr from 'listr'

import { getCurrentBranch } from '../git'
import execa from 'execa'

export default function getGitTasks(projectConfig) {
    const tasks = [{
        task: async () => {
            const allowedBranches = projectConfig.releaseBranch ? [projectConfig.releaseBranch] : ['main', 'master']
            const currentBranch = await getCurrentBranch()
            if (!allowedBranches.includes(currentBranch)) {
                throw new Error(`Not on ${allowedBranches.map(branch => `${branch}`).join('/')} branch`)
            }
        },
        title: 'Check current branch'
    }, {
        task: async () => {
            let workingTreeClean

            try {
                const { stdout: status } = await execa('git', ['status', '--porcelain'])
                if (status !== '') workingTreeClean = false
            } catch (err) {
                workingTreeClean = false
            }

            if (workingTreeClean === false) {
                throw new Error('Unclean working tree. Commit or stash changes first.')
            }
        },
        title: 'Check local working tree'
    }, {
        task: async () => {
            let history
            try {
                const { stdout } = await execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
                history = stdout
            } catch (err) {}

            if (history && history !== '0') {
                throw new Error('Remote history difffers. Please pull changes')
            } 
        },
        title: 'Check remote history'
    }]

    return new Listr(tasks)
}