const prefix = 'process.env.'

function formatStandardEnvironment(env) {
    return Object.keys(env).reduce((acc, key) => ({
        ...acc,
        [`${prefix}${key.toUpperCase()}`]: JSON.stringify(acc[key])
    }), {})
}

export default function getRollupEnv({ env, format, name, target, version }) {
    // Grab this like this so we aren't accidentally optimizing ourselves
    const protectEnv = process.env
    const outputEnv = protectEnv.NODE_ENV
    const environmentVariables = {
        ...formatStandardEnvironment(env),
        [`${prefix}BUNDLE_NODE_ENV`]: JSON.stringify(outputEnv),
        [`${prefix}BUNDLE_NAME`]: JSON.stringify(name),
        [`${prefix}BUNDLE_TARGET`]: JSON.stringify(target),
        [`${prefix}BUNDLE_VERSION`]: JSON.stringify(version)
    }

    // Only inject NODE_ENV for umd (browser) bundles. For all other cases
    // this is best handled by the user.
    // - Live variables for CLI and Node
    // - Bundle Injection for Webpack
    if (format === 'umd' && outputEnv) {
        environmentVariables[`${prefix}NODE_ENV`] = JSON.stringify(outputEnv)
    }

    return environmentVariables
}