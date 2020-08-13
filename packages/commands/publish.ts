import { bundle } from '../bundler'
import { createPublisher } from '../publisher'

export default async function publish(projectConfig) {
    const publisher = createPublisher(projectConfig)
    await publisher.run()
}