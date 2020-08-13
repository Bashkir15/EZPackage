import execa from 'execa'
import Listr from 'listr'

export default function getTestTasks(projectConfig) {
    const tasks = [{
        enabled: () => projectConfig.yarn === false,
        task: () => execa('npm', projectConfig.testCommand),
        title: 'Running tests using npm'
    }, {
        enabled: () => projectConfig.yarn === true,
        task: () => execa('yarn', projectConfig.testCommand),
        title: 'Running tests using yarn'
    }]

    return tasks
}