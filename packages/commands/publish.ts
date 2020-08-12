import * as Listr from 'listr'

import { bundle } from '../bundler'

export default async function publish(projectConfig) {
    const tasks = new Listr()

    if (projectConfig.runBuild) {
        // TODO: Insure that watch is false here
        tasks.add({
            task: async () => await bundle(projectConfig),
            title: 'Building the Project'
        })
    }

    // Run tests if npm script configured
    if (projectConfig.runTests) {}
    // Handle publishing stuff
    if (projectConfig.runPublish) {}

    await tasks.run()
}