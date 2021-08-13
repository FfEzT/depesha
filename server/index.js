// import modules
const ws = require('ws')
const db = require('./data.js')

// creating server with port 5480
const server = new ws.Server(
    {port: 5480}
)

// list of connected clients
let clients = {}

// this f is called after the client connects to the server
let connection_to_server = e => {
    e.on(
        'message',
        data => {
            data = JSON.parse(data)

            let cases = {
                'sign_up': () => {
                    sign_up(e, data.content)
                },
                'auth': () => {
                    auth(e, data.content)
                },
                'update_status': () => {
                    update_status(data.content)
                }
            }
            cases[data.type] && cases[data.type]()
        }
    )
}

// for f:connection_to_server
let sign_up = async (e, content) => {
    let id = generate_id()
    let check

    await db.people().get_user(id).then(
        d => check = d
    )

    check?
        sign_up(e, content)
    :
        (
            await db.people().sign_up(id, content.nickname, content.password).then(
                () => {
                    e.send(
                        JSON.stringify(
                            {result: 1, id}
                        )
                    )
                }
            )
        )
}
let auth = async (e, content) => {
    let people
    
    await db.people().get_user(content.id).then(
        d => people = d
    )

    people?
        (
            people.password == content.password ?
                (
                    e.send(
                        JSON.stringify(
                            {
                                result: 1,
                                nick: people.nickname
                            }
                        )
                    ),
                    content.connect && !function(){
                        clients[people.id] = {
                            status: 'online',
                            ws
                        }
                        e.on(
                            'close',
                            () => {
                                delete clients[people.id]
                            }
                        )
                    }()
                )
            : notice_incorrect_data(e)
        )
    : notice_incorrect_data(e)
}
let update_status = content => {
    clients[content.id].status = content.status
}

// send notice incorrect data
let notice_incorrect_data = e => {
    e.send(
        JSON.stringify(
            {
                result: 0
            }
        )
    )
}

let generate_id = () => {
    function vowel(a){
        let str = 'yuiiooaaeee'
    
        !a?
            letter = 0
        :
            letter = 1
    
        let rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    function consonant(){
        let str = 'ttttnnnssshhrrddllccmmwwffggppbbvvkkxjqz'
    
        letter = 2
    
        let rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    
    let letter, result = ''
    let value = Math.round(
        Math.random() * 4 + 3
    )
    
    for (let i = 0; i < value; i++){
        if (!letter || letter == 0){
            let first_rand = Math.round(
                Math.random()
            )
    
            let bag = {
                0: () => {
                    result += vowel(true)
                },
                1: () => {
                    result += consonant()
                }
            }
    
            bag[first_rand] && bag[first_rand]()
        }
        else if (letter == 1){
            result += consonant()
        }
        else if (letter == 2){
            result += vowel()
        }
    }
    
    return result
}

// add events for server
server.on('connection', connection_to_server)
