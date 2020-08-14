import { EZCli } from './cli'


(async () => {
    const args = process.argv.slice(2)
    const cli = new EZCli(args)
    try {
        const result = await cli.run()
        if (!result.successful) {
            // Do something with error
        }
    // Use async exit hook?
    } catch (err) {
        console.error(err)
        if (err.stack) {
            console.error(err.stack)
        }
    }
})()