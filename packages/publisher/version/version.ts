import semver from 'semver'

import { SEMVER_INCREMENTS } from '../../constants'

import { validateReleaseType, validateVersion } from './validate'

export function versionSatisfiesRange(version, range) {
    validateVersion(version)
    return semver.satisfies(version, range, {
        includePrerelease: true
    })
}

export function getNewVersionFrom(version, releaseType) {
    validateVersion(version)
    validateReleaseType(releaseType)
    return SEMVER_INCREMENTS.includes(releaseType) ? semver.inc(version, releaseType) : releaseType
}

export function isGreaterThanOrEqualToInitialVersion(version1, version2) {
    validateVersion(version1)
    validateVersion(version2)
    return semver.gte(version2, version1)
}

export function isLessThanOrEqualToInitialVersion(version1, version2) {
    validateVersion(version1)
    validateVersion(version2)
    return semver.lte(version2, version1)
}

export function isPrereleaseVersion(version) {
    return Boolean(semver.prerelease(version))
}