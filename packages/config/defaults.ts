import env from 'std-env'

export default function createBaseConfig() {
    return {
        // Allows publishing from any branch
        anyBranch: false,
        // Name of the release branch
        branch: 'master',
        // Cleanup node_moudules and build files after
        cleanup: true,
        // Sub directory to publish
        contents: '.',
        entries: {
            browser: null,
            cli: null,
            library: null,
            node: null
        },
        // Enable 2FA on new packages
        enableTwoFactor: true,
        env,
        exec: false,
        notify: false,
        packageJSON: {
            author: '',
            bin: '',
            browser: '',
            dependencies: null,
            devDependencies: null,
            main: '',
            module: '',
            name: '',
            umd: '',
            version: '0.0.0'
        },
        paths: {
            output: null,
            root: process.cwd()
        },
        // Show tasks without executing them
        preview: false,
        // Open a github release draft after releasing
        releaseDraft: true,
        // Function to override rollup configuration
        rollup: (passedConfig = {}, options = {}) => passedConfig,
        // Whether test scripts should be skipped before publishing/building
        skipTests: false,
        // Publish under a givien dist-tag
        tag: 'latest',
        // Name of the test script to run
        testScript: 'test',
        quiet: false,
        verbose: false,
        watch: false,
        // Use yarn if possible
        yarn: false
    }
}