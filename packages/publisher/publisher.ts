import Listr from 'listr'

import { PublisherInterface, PublishTasks } from '../types/publisher'
import { ProjectConfig } from '../types/shared'
import { PUBLISH_STATUSES } from '../constants'

class Publisher implements PublisherInterface {
    publishStatus = PUBLISH_STATUSES.Unknown
    projectConfig: ProjectConfig
    tasks: PublishTasks
    
    constructor(projectConfig: ProjectConfig) {
        this.projectConfig = projectConfig
    }

    getPublishStatus() {
        return this.publishStatus
    }

    async rollback() {}

    async getTasks() {
        const tasks = new Listr()
    }
}