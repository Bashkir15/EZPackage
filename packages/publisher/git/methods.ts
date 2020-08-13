import execa from 'execa'

export function gitPush() {
    return execa('git', ['push', '--follow-tags'])
}