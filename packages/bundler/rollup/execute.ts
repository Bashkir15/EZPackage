import { rollup, watch, RollupBuild, RollupOptions } from 'rollup'


async function createBundle(rollupConfig: RollupOptions) {
    try {
        const bundle = await rollup(rollupConfig)
        return bundle
    } catch (bundleError) {
        throw bundleError
    }
}

async function writeBundle(bundle: RollupBuild, passedConfig: RollupOptions) {
    try {
        const output = await bundle.write(passedConfig)
        return output
    } catch (writeError) {
        throw writeError
    }
}

export async function executeRollupCompile(rollupConfig: RollupOptions) {
    const bundle = await createBundle(rollupConfig)
    // Possibly do something with the stats? Idk.
    return writeBundle(bundle, rollupConfig)
}

export function executeRollupWatch(rollupConfigs: RollupOptions[]) {
    return watch(rollupConfigs)
}