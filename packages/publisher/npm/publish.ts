import execa from 'execa'

export function getPackagePublishArguments(projectConfig) {
    const args = ['publish']
    if (projectConfig.contents) {
        args.push(projectConfig.contents)
    }
    if (projectConfig.tag) {
        args.push('--tag', projectConfig.tags)
    }
    return args
}

export function publishPackage(packageManager, projectConfig) {
    return execa(packageManager, getPackagePublishArguments(projectConfig))
}