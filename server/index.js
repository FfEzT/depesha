"use strict"

//import modules
const ws = require('ws')
const db = require('./data.js')

//creating server with port 5480
const server = new ws.Server({port: 5480})

//list of connected clients
let clients = {}

//this f is called after the client connects to the server
let connection_to_server = e => {
    //send to client 'incorrect data'
    //input: str(values: auth || do_friends)
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
                },
                'message_to_friend': () => {
                    send_message(data.content)
                }
            }
            cases[data.type] && cases[data.type]()
        }
    )
}

//for f:connection_to_server
let sign_up = async (e, content) => {
    let id = generate_id()
    let check = await db.people().get_user(id)

    check?
        sign_up(e, content)
        :
        (
            db.people().sign_up(id, content.nickname, content.password, content.public_key).then(
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
    let people = await db.people().get_user(content.id)
    let type = 'auth'

    people?
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
                    db.people().update_status(content.id, 'online')
                    clients[people.id] = e

                    db.people().get_user(content.id).then(
                        d => {
                            d.changes_friends == 1 && !function(){
                                send_friends(e, content.id)
                                
                                db.people().update_friends(content.id, 0)
                            }()
                            d.new_message == 1 && !function() {
                                db.temp_mail.get(content.id).then(
                                    data => {
                                        e.send(
                                            JSON.stringify(
                                                {
                                                    type: 'new_message',
                                                    data
                                                }
                                            )
                                        )
                                    }
                                )
                                db.people().update_new_message(content.id, 0)
                            }()
                        }
                    )
                    
                    e.on(
                        'close',
                        () => {
                            db.people().update_status(people.id, 'offline')
                            delete clients[people.id]
                        }
                    )
                }()
            )
            : f(type)
        : f(type)
}
let update_status = content => {
    db.people().update_status(content.id, content.status)
}
//send list of friends to client
//input: object(from WebSocket), str(id of client)
let send_friends = (e, content) => {
    db.friends().get_friends(content).then(
        data => {
            let a = JSON.stringify(
                {
                    type: 'list_of_friends',
                    data
                }
            )

            let ws = clients[content] || e
            ws.send(a)
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

                                clients[content.to]?
                                    send_friends(e, content.to)
                                    :
                                    db.people().update_friends(content.to, 1)

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
        },
        'add': () => {
            db.friends().add_friend(content.from, content.to).then(
                () => {
                    send_friends(e, content.from)

                    clients[content.to]?
                        send_friends(e, content.to)
                        :
                        db.people().update_friends(content.to, 1)
                }
            )
        },
        'delete': () => {
            db.friends().delete_friend(content.from, content.to).then(
                () => {
                    send_friends(e, content.from)

                    clients[content.to]?
                        send_friends(e, content.to)
                        :
                        db.people().update_friends(content.to, 1)
                }
            )
        }
    }
    bag[content.status] && bag[content.status]()
}

// send message to peoples
// in: obj (from client)
let send_message = data => {
    const man = clients[data.to]

    man? (
        man.send(
            JSON.stringify(
                {
                    type: 'new_message',
                    data: [
                        {
                            who: data.who,
                            time: data.time,
                            content: data.content
                        }
                    ]
                }
            )
        )
    ) : (
        db.people().update_new_message(data.to, 1),
        db.temp_mail.set(data.to, data.who, data.time, data.content)
    )
}

//generate future id for users
//output str (lenght: 3-7)
let generate_id = () => {
    let vowel = a => {
        let str = 'yuiiooaaeee'
    
        a?
            letter = 1
            :
            letter = 0
    
        let rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    let consonant = () => {
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
        if(!letter || letter == 0){
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
        else if(letter == 1){
            result += consonant()
        }
        else if(letter == 2){
            result += vowel()
        }
    }
    
    return result
}

//add events for server
server.on('connection', connection_to_server)
