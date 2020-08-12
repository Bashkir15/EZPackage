import execa from 'execa'

export async function getGitVersion() {
    const { stdout } = await execa('git', ['version'])
    const match = /git version (?<version>\d+\.\d+\.\d+).*/.exec(stdout)
    return match && match.groups.version
}

export async function verifyGitRemoteIsValid() {
    try {
        await execa('git', ['ls-remote', 'origin', 'HEAD'])
    } catch (err) {
        throw new Error(err.stderr.replace('fatal:', 'Git fatal error:'))
    }
}