import execa from 'execa'

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