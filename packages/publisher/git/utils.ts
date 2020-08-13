import execa from 'execa'
import escapeStringRegExp from 'escape-string-regexp'

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

export async function getCurrentBranch() {
    const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'])
    return stdout
}

export async function hasUpstream() {
    const currentBranch = await getCurrentBranch()
    const escapedBranch = escapeStringRegExp(currentBranch)
    const { stdout } = await execa('git', ['status', '--short', '--branch', '--porcelain'])
    return new RegExp(String.raw`^## ${escapedBranch}\.\.\..+\/${escapedBranch}`).test(stdout)
}