import execa from 'execa'

import { isExternalNPMRegistry } from './registry'

export async function getNPMUsername(externalRegistry) {
    try {
        const { stdout } = await execa('npm', externalRegistry ? ['whoami', '--resgitry', externalRegistry] : ['whoami'])
        return stdout
    } catch (err) {
        throw new Error(/ENEEDAUTH/.test(err.stderr)
            ? 'You must be logged in. Use npm login and try again'
            : 'Authentication error. Use npm whoami to troubleshoot'
        )
    }
}

export async function getPackageCollaborators(packageJSON) {
    const args = ['access', 'ls-collaborators', packageJSON.name]
    if (isExternalNPMRegistry(packageJSON)) {
        args.push('--registry', packageJSON.publishConfig.registry)
    }    

    try {
        const { stdout } = await execa('npm', args)
        return stdout
    } catch (err) {
        // Ignore non-existing package error
        if (err.stderr.includes('code E404')) {
            return false
        }
        throw err
    }
}