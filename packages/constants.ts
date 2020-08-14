export const PACKAGE_LOCKFILES = ['yarn.lock', 'package-lock.json', 'npm-shrinkwrap.json']
export const NPM_REGISTRY_TIMEOUT = 15000
export const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease']
export const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease']

export const DEFAULT_RELEASE_BRANCHES = ['main', 'master']

export enum PUBLISH_STATUSES {
    Failed = 'FAILED',
    Success = 'SUCCESS',
    Unknown = 'UNKNOWN'
}

export const TYPESCRIPT_EXTENSIONS = ['.ts', '.tsx']
export const SCRIPT_EXTENSIONS = ['.js', '.jsx', '.mjs', ...TYPESCRIPT_EXTENSIONS]

export const GLOBAL_CLI_ARGS = [{
    description: 'Whether to receive desktop notifications',
    name: 'notify',
    type: Boolean
}, {
    description: 'Path to ezpackage configuration file',
    name: 'configPath',
    type: String
}, {
    description: 'Path to output builds in',
    name: 'outputPath',
    type: String
}, {
    description: 'Root directory for the package',
    name: 'rootPath',
    type: String
}, {
    description: 'Whether to clean up node_modules/build files',
    name: 'runCleanup',
    type: Boolean
}, {
    description: 'Whether to use verbose output logging',
    name: 'verbose',
    type: Boolean
}, {
    description: 'Whether to use Yarn as a package manager',
    name: 'useYarn',
    type: Boolean
}]