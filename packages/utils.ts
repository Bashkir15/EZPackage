import execa from 'execa'
import memoizePromise from 'p-memoize'
import pMemoize from 'p-memoize'

export const getVersionTagPrefix = memoizePromise(async (useYarn: boolean) => {
    try {
        if (useYarn) {
            const { stdout } = await execa('yarn', ['config', 'get', 'version-tag-prefix'])
            return stdout
        }
        const { stdout } = await execa('npm', ['config', 'get', 'tag-version-prefix'])
        return stdout
    } catch (err) {
        return 'v'
    }
})
