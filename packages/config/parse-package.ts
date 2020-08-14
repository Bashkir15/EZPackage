import * as path from 'path'
import { pathExists, readJSON } from 'fs-extra'

import { PACKAGE_LOCKFILES } from '../constants'

const formatDependency = (dep = {}) => {
    return new Set(Object.keys(dep))
}

async function hasLockFile(root) {
    // Something like Promise.race here? 
    const files = await Promise.all(PACKAGE_LOCKFILES.map(file => {
        return pathExists(path.resolve(root, file))
    }))
    return files.includes(true)
}

export default async function parsePackage(root) {
    const packagePath = path.join(root, 'package.json')
    const packageExists = await pathExists(packagePath)

    if (!packageExists) {
        throw new Error('Could not find a package.json for the project')
    }

    const hasPackageLock = await hasLockFile(root)

    const { dependencies = {}, devDependencies = {}, peerDependencies = {}, publishConfig = {}, ...rest } = await readJSON(packagePath)
    return {
        hasPackageLock,
        packageJSON: {
            ...rest,
            dependencies: {
                development: formatDependency(devDependencies),
                peer: formatDependency(peerDependencies),
                runtime: formatDependency(dependencies)
            }
        },
        useExternalRegistry: publishConfig && typeof publishConfig.registry === 'string'
    }
}