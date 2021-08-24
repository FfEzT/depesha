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
    // send to client 'incorrect data'
    // input: str(values: auth || do_friends)
    let notice_incorrect_data = type => {
        e.send(
            JSON.stringify(
                {
                    type,
                    result: 0
                }
            )
        )
    }

    e.on(
        'message',
        data => {
            data = JSON.parse(data)

            let cases = {
                'sign_up': () => {
                    sign_up(e, data.content)
                },
                'auth': () => {
                    auth(e, data.content, notice_incorrect_data)
                },
                'update_status': () => {
                    update_status(data.content)
                },
                'get_friends': () => {
                    send_friends(e, data.content.id)
                },
                'do_friend': () => {
                    do_friend(e, data.content, notice_incorrect_data)
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
            db.people().sign_up(id, content.nickname, content.password).then(
                () => {
                    e.send(
                        JSON.stringify(
                            {
                                result: 1,
                                id
                            }
                        )
                    )
                }
            ),
            db.friends().create_list(id)
        )
}
let auth = async (e, content, f) => {
    // data from DataBase
    // type: {object}
    let people
    let type = 'auth'
    
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
                                type,
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
                : f(type)
        )
        : f(type)
}
let update_status = content => {
    clients[content.id].status = content.status
}
let send_friends = (e, content) => {
    db.friends().get_friends(content).then(
        data => {
            let a = {
                type: 'list_of_friends',
                data
            }
            a = JSON.stringify(a)
            e.send(a)
        }
    )
}
let do_friend = (e, content, f) => {
    let bag = {
        'search': () => {
            db.people().get_user(content.to).then(
                d => {
                    !d?
                        f('do_friends')
                        :
                        db.friends().write(content.from, content.to, 'waiting').then(
                            () => {
                                db.friends().write(content.to, content.from, 'pending')

                                send_friends(e, content.from)

                                e.send(
                                    JSON.stringify(
                                        {
                                            type: 'do_friends',
                                            result: 1
                                        }
                                    )
                                )
                                
                            }
                        ).catch(
                            () => f('do_friends')
                        )
                }
            )
        }
    }
    bag[content.status] && bag[content.status]()
}

// generate future id for users
// output str (lenght: 3-7)
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
