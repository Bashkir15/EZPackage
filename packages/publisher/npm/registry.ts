import execa from 'execa'
import pTimeout from 'p-timeout'

import { NPM_REGISTRY_TIMEOUT } from '../../constants'

export function isExternalNPMRegistry(pkg) {
    return typeof pkg.publishConfig === 'object' && typeof pkg.publishConfig.registry === 'string'
}

export async function checkRegistryConnection() {
    return pTimeout((async () => {
        try {
            await execa('npm', ['ping'])
            return true
        } catch (err) {
            throw new Error('Connection to npm registry failed')
        }
    })(), NPM_REGISTRY_TIMEOUT, 'Connection to npm registry timed out')
}

