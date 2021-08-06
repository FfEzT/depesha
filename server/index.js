const ws = require('ws')
const server = new ws.Server(
    {port: 5480}
)
const fs = require('fs')

let sign_up = (content) => {
    // todo
    console.log(content)
}
let auth = (e, content) => {
    let people = JSON.parse(
        fs.readFileSync('./data/people.json')
    )

    let notice_incorrect_data = () => {
        e.send(
            JSON.stringify(
                {
                    result: 0
                }
            )
        )
    }

    people[content.id]?
        !function(){
            people[content.id]['password'] == content.password?
                e.send(
                    JSON.stringify(
                        {
                            result: 1,
                            nick: people[content.id]['name']
                        }
                    )
                )
            :   notice_incorrect_data()
        }()
    :   notice_incorrect_data()
}

let connection_to_server = e => {
    e.on(
        'message',
        (data) => {
            data = JSON.parse(data)

            let cases = {
                'sign_up': () => {
                    sign_up(data.content)
                },
                'auth': () =>{
                    auth(e, data.content)
                }
            }
            cases[data.type] && cases[data.type]()
        }
    )
}

server.on('connection', connection_to_server)
