import path from 'path'

import { BundlerPackageOutput } from '../../types'

export default function getBundleOutputs(output: string, pkg): BundlerPackageOutput {
    if (output) {
        return {
            binaries: {
                index: path.join(output, 'index.js')
            },
            browser: null,
            main: path.join(output, 'index.cjs.js'),
            module: path.join(output, 'index.esm.js'),
            types: path.join(output, 'index.d.ts')
        }
    }

    return {
        binaries: typeof pkg.bin === 'object' ? pkg.bin : null,
        browser: pkg.browser || null,
        main: pkg.main || null,
        module: pkg.module || pkg['jsnext:main'] || null,
        types: pkg.types || null,
        umd: pkg.umd || pkg.unpkg || null
    }
}