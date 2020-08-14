export default function getPackageBanner(pkg: any) {
    let banner = `/* ${pkg.name} v${pkg.version}`
    if (pkg.author) {
        if (typeof pkg.author === 'object') {
            banner += ` by ${pkg.author.name} <${pkg.author.email}>`
        } else if (typeof pkg.author === 'string') {
            banner += ` by ${pkg.author}`
        }
    }

    return `${banner} */`
}