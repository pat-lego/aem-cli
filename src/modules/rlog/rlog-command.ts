import { Command } from 'commander'
import BaseCommand from '../base-command.js'

export interface IRequestLog {
    top: Number,
    requestLog: String
}

export default class RequestLog implements BaseCommand {
    name: string = 'rlog'

    parse(): Command {
        const program = new Command(this.name)
        program
            .command('analyze')
            .alias('a')
            .action((args : IRequestLog) => {
                this.run(args, 'analyze')
            })

        return program
    }

    run(args: IRequestLog, cmd: string): void {
        // TODO actually implement this sample function
       console.log('Request log was called')
    }

}