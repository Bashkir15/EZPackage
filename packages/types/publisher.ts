import { ListrTask } from 'listr'
import { ProjectConfig } from './shared'

export type PublishStatus = 'FAILED' | 'SUCCESS' | 'UNKNOWN'
export type PublishTasks = ListrTask[]

export interface PublisherInterface {
    projectConfig: ProjectConfig;
    publishStatus: PublishStatus;
    tasks: PublishTasks;
    getPublishStatus(): PublishStatus;
    getTasks(): Promise<void>;
    rollback(): Promise<void>;
}