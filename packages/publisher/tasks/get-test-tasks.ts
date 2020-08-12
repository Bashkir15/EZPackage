import execa from 'execa'

export default function getTestTasks(projectConfig) {
    return [{
        enabled: () => projectConfig.yarn === false,
        task: () => execa('npm', projectConfig.testCommand),
        title: 'Running tests using npm'
    }, {
        enabled: () => projectConfig.yarn === true,
        task: () => execa('yarn', projectConfig.testCommand),
        title: 'Running tests using yarn'
    }]
}