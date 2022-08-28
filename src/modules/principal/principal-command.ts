import { Command, Option } from "commander"

import BaseCommand from "../base-command.js"
import BaseEvent from "../base-event.js"
import httpclient from '../../utils/http.js'
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"

export default class PrincipalCommand extends BaseCommand<BaseEvent> {
    name: string = 'principal'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('create:user')
            .alias('cusr')
            .argument('<username>', 'The users name')
            .argument('<authorizableId>', 'The ID of the user')
            .argument('<password>', 'The users password')
            .addOption(new Option('-p, --profile <args...>', 'A lit of arguments that will represent properties in the profile, example: age=25'))
            .action((username: string, authorizableId: string, password: string, options: string[]) => {
                this.createUser(username, authorizableId, password, options)
            })
        return program
    }

    createUser(username: string, authorizableId: string, password: string, options: string[]) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        
        let formData = new window.FormData()
        formData.append('createUser', username)
        formData.append('authorizableId', authorizableId)
        formData.append('rep:password', password)

        formData = this.appendOptionsForCreateUser(formData, options)

        httpclient.post({serverInfo: serverInfo, path: '/libs/granite/security/post/authorizables', body: formData, headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    appendOptionsForCreateUser(formData: FormData, options: string[]): FormData {
        if (options) {
            for(const option in options) {
                const anOption: string[] = option.split('=')

                if (anOption.length == 2) {
                    formData.append(`profile/${anOption[0]}`, anOption[1])
                }
            }
        }

        return formData
    }
}