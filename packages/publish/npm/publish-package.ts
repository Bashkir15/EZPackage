import execa from 'execa'

export default async function publishPackage(packageManager) {
    try {
        await execa(packageManager, ['publish'])
    } catch (publishError) {
        throw publishError
    }
}