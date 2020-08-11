import { rollup, watch } from 'rollup'

async function createBundle(rollupConfig) {
    try {
        const bundle = await rollup(rollupConfig)
        return bundle
    } catch (bundleError) {
        throw bundleError
    }
}

async function writeBundle(bundle, passedConfig) {
    try {
        const output = await bundle.write(passedConfig)
        return output
    } catch (writeError) {
        throw writeError
    }
}

export async function executeRollupCompile(rollupConfig) {
    const bundle = await createBundle(rollupConfig)
    // Possibly do something with the stats? Idk.
    return writeBundle(bundle, rollupConfig)
}

export function executeRollupWatch(rollupConfigs) {
    return watch(rollupConfigs)
}