import * as path from 'path'
import { pathExists, readJSON } from 'fs-extra'

const formatDependency = (dep = {}) => {
    return new Set(Object.keys(dep))
}

export default async function parsePackage(root) {
    const packagePath = path.join(root, 'package.json')
    const packageExists = await pathExists(packagePath)
    if (!packageExists) {
        throw new Error('Could not find a package.json for the project')
    }

    const { dependencies = {}, devDependencies = {}, peerDependencies = {}, ...rest } = await readJSON(packagePath)
    return {
        ...rest,
        dependencies: {
            development: formatDependency(devDependencies),
            peer: formatDependency(peerDependencies),
            runtime: formatDependency(dependencies)
        }
    }
}