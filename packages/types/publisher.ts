import Listr from 'listr'
import { ProjectConfig } from './shared'

export type PublishStatus = 'FAILED' | 'SUCCESS' | 'UNKNOWN'

export interface PublisherInterface {
    projectConfig: ProjectConfig;
    publishStatus: PublishStatus;
    getPublishStatus(): PublishStatus;
    getTasks(): Promise<Listr>;
    rollback(): Promise<void>;
}