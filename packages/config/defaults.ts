import env from 'std-env'

import { ProjectConfig } from '../types'

export default function createBaseConfig(rootDir = '') : ProjectConfig {
    return {
        entries: {
            browser: null,
            cli: null,
            library: null,
            node: null
        },
        env,
        exec: false,
        interactive: true,
        notify: false,
        packageJSON: {
            author: '',
            bin: '',
            browser: '',
            dependencies: {
                development: null,
                peer: null,
                runtime: null
            },
            main: '',
            module: '',
            name: '',
            umd: '',
            version: '0.0.0'
        },
        paths: {
            config: '',
            output: '',
            root: rootDir,
            test: ''
        },
        // Function to override rollup configuration
        rollup: (passedConfig = {}, options) => passedConfig,
        quiet: false,
        verbose: false,
        watch: false,
        // Use yarn if possible
        useYarn: false
    }
}