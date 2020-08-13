import execa from 'execa'
import Listr from 'listr'

import { verifyGitRemoteIsValid } from '../git'
import { 
    checkRegistryConnection, 
    getNPMUsername,
    getPackageCollaborators,
    isExternalNPMRegistry 
} from '../npm'
import { 
    getNewVersionFrom,
    isLessThanOrEqualToInitialVersion,
    isPrereleaseVersion,
    validateReleaseType,
} from '../version'

export default function getInitialTasks(projectConfig) {
    // TOOD: This packageJSON ref needs to be THIS projects packageJSON.
    //       small brained when I was writing here
    const { env, packageJSON, releaseType, tag, useYarn } = projectConfig
    const isExternalRegistry = isExternalNPMRegistry(packageJSON)
    
    let newPackageVersion

    const tasks = [{
        skip: () => packageJSON.private || isExternalRegistry,
        task: () => checkRegistryConnection(),
        title: 'Pinging npm registry'
    }, {
        skip: env.test || packageJSON.private,
        task: async () => {
            const username = await getNPMUsername(isExternalRegistry ? packageJSON.publishConfig.registry : false)
            const collaborators = await getPackageCollaborators(packageJSON)
            if (!collaborators) return

            const parsed = JSON.parse(collaborators)
            const permissions = parsed[username]
            if (!permissions || !permissions.includes('write')) {
                throw new Error('You do not have write permissions that are required to publish this package')
            }
        },
        title: 'Verify user is authenticated on npm'
    }, {
        task: () => verifyGitRemoteIsValid(),
        title: 'Checking git remote'
    }, {
        task: () => {
            validateReleaseType(releaseType)
            newPackageVersion = getNewVersionFrom(packageJSON.version, releaseType)
            if (isLessThanOrEqualToInitialVersion(packageJSON.version, newPackageVersion)) {
                throw new Error(`New version ${newPackageVersion} should be higher than the current version ${packageJSON.version}`)
            }
        },
        title: 'Validating release version'
    }, {
        task: () => {
            if (!packageJSON.private && isPrereleaseVersion(newPackageVersion) && !tag) {
                throw new Error('You must specify a dist tag when publishing a prerelease version')
            }
        },
        title: 'Checking for pre-release version'
    }]

    return new Listr(tasks)
}