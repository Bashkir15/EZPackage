import execa from 'execa'
import escapeStringRegexp from 'escape-string-regexp'


export async function getCurrentBranch() {
    const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'])
    return stdout
}

export async function hasUpstreamBranch() {
    const currentBranch = await getCurrentBranch()
    const escapedBranch = escapeStringRegexp(currentBranch)
    const { stdout } = await execa('git', ['status', '--short', '--branch', '--portcelain'])
    return new RegExp(String.raw`^## ${escapedBranch}\.\.\..+\/${escapedBranch}`).test(stdout)
}

export async function isRemoteHistoryClean(): Promise<boolean> {
    let history
    try {
        const { stdout } = await execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
        history = stdout
    } catch (err) {}

    if (history && history !== '0') {
        return false
    }

    return true
}

export async function isWorkingTreeClean(): Promise<boolean> {
    try {
        const { stdout: status } = await execa('git', ['status', '--porcelain'])
        if (status !== '') {
            return false
        }
        return true
    } catch (err) {
        return false
    }
}
