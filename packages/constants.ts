export const NPM_REGISTRY_TIMEOUT = 15000
export const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease']
export const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease']

export const DEFAULT_RELEASE_BRANCHES = ['main', 'master']
export const PUBLISH_STATUSES = {
    Failure: 'FAILURE',
    Success: 'SUCCESS',
    Unknown: 'UNKNOWN'
}

export const TYPESCRIPT_EXTENSIONS = ['.ts', '.tsx']
export const SCRIPT_EXTENSIONS = ['.js', '.jsx', '.mjs', ...TYPESCRIPT_EXTENSIONS]