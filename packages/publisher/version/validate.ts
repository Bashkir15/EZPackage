import semver from 'semver'
import { PRERELEASE_VERSIONS, SEMVER_INCREMENTS } from '../../constants'

function isValidVersion(version) {
    return Boolean(semver.valid(version))
}

function isValidReleaseType(version) {
    return SEMVER_INCREMENTS.includes(version) || isValidVersion(version)
}

export function validateVersion(version) {
    if (!isValidVersion(version)) {
        throw new Error('Version should be a valid semver version')
    }
}

export function validateReleaseType(releaseType) {
    if (!isValidReleaseType(releaseType)) {
        throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version`)
    }
}