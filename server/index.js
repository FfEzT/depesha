/*
 * This file is part of Depesha.

 * Depesha is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Depesha is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with Depesha.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict"

const PORT = 5480

// list of connected clients
const clients = {}

const ws = require('ws')
const db = require('./data.js')

const server = new ws.Server(
    {port: PORT}
)

/**
 * this f is called after the client connects to the server
 * @param {{}} e websocket
 */
const connection_to_server = e => {
    /**
     * send to client 'incorrect data'
     * @param {string} type auth || do_friends
     */
    const notice_incorrect_data = type => {
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

            switch (data.type) {
                case "sign_up":
                    sign_up(e, data.content)
                    break

                case "auth":
                    auth(e, data.content, notice_incorrect_data)
                    break

                case "update_status":
                    update_status(data.content)
                    break

                case "get_friends":
                    send_friends(e, data.content.id)
                    break

                case "do_friend":
                    do_friend(e, data.content, notice_incorrect_data)
                    break

                case "message_to_friend":
                    send_message(data.content)
                    break
            }
        }
    )
}

/**
 * @param {WebSocket} e for response
 * @param {{}} content info about new user
 */
const sign_up = async (e, content) => {
    const id = generate_id()
    const check_in_db = await db.people.get_user(id)

    if (check_in_db) {
        sign_up(e, content)
    }
    else {
        db.people.sign_up(id, content.nickname, content.password, content.public_key).then(
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
        db.friends.create_list(id)
    }
}
/**
 * @param {WebSocket} e for response
 * @param {{}} content info about user
 * @param {function} f function notice_incorrect_data
 */
const auth = async (e, content, f) => {
    /**
     * @type {{}}
     */
    const people = await db.people.get_user(content.id)
    const type = 'auth'

    if (people) {
        if (people.password === content.password) {
            e.send(
                JSON.stringify(
                    {
                        type,
                        result: 1,
                        nick: people.nickname
                    }
                )
            )

            if (content.connect) {
                db.people.update_status(content.id, 'online')
                clients[people.id] = e

                db.people.get_user(content.id).then(
                    d => {
                        if (d.changes_friends == 1) {
                            send_friends(e, content.id)
                            db.people.update_friends(content.id, 0)
                        }
                        if (d.new_message == 1) {
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
                            db.people.update_new_message(content.id, 0)
                        }
                    }
                )
                
                e.on(
                    'close',
                    () => {
                        db.people.update_status(people.id, 'offline')
                        delete clients[people.id]
                    }
                )
            }
        }
        else {
            f(type)
        }
    }
    else {
        f(type)
    }
}
/**
 * online || ofline
 * @param {{}} content
 */
const update_status = content => {
    db.people.update_status(content.id, content.status)
}
/**
 * send list of friends to client
 * @param {WebSocket} e
 * @param {string} content id of client
 */
const send_friends = (e, content) => {
    db.friends.get_friends(content).then(
        data => {
            const a = JSON.stringify(
                {
                    type: 'list_of_friends',
                    data
                }
            )

            const ws = clients[content] || e
            ws.send(a)
        }
    )
}
/**
 * @param {WebSocket} e
 * @param {{}} content
 * @param {Function} f notice_incorrect_data
 */
const do_friend = (e, content, f) => {
    const update_friend_list_client = (to) => {
        if ( clients[to] ) {
            send_friends(e, to)
        }
        else {
            db.people.update_friends(to, 1)
        }
    }
    switch (content.status) {
        case "search":
            db.people.get_user(content.to).then(
                user => {
                    if (user) {
                        db.friends.write(content.from, content.to, 'waiting')
                        .then(
                            () => {
                                db.friends.write(content.to, content.from, 'pending')

                                send_friends(e, content.from)

                                update_friend_list_client(content.to)

                                e.send(
                                    JSON.stringify(
                                        {
                                            type: 'do_friends',
                                            result: 1
                                        }
                                    )
                                )
                                
                            }
                        )
                        .catch(
                            () => f('do_friends')
                        )
                    }
                    else {
                        f("do_friends")
                    }
                }
            )
            break
        case "add":
            db.friends.add_friend(content.from, content.to).then(
                () => {
                    send_friends(e, content.from)

                    update_friend_list_client(content.to)
                }
            )
            break
        case "delete":
            db.friends.delete_friend(content.from, content.to).then(
                () => {
                    send_friends(e, content.from)

                    update_friend_list_client(content.to)
                }
            )
            break
    }
}

/**
 * for sending messages
 * @param {{}} data 
 */
const send_message = data => {
    const man = clients[data.to]

    if (man) {
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
    }
    else {
        db.people.update_new_message(data.to, 1),
        db.temp_mail.set(data.to, data.who, data.time, data.content)
    }
}

/**
 * generate future id for new users
 * @returns {string} length of string 3-7
 */
const generate_id = () => {
    const vowel = a => {
        const str = 'yuiiooaaeee'
    

        letter = a? 1 : 0
    
        const rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    const consonant = () => {
        const str = 'ttttnnnssshhrrddllccmmwwffggppbbvvkkxjqz'
    
        letter = 2
    
        const rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    
    let letter, result = ''
    let value = Math.round(
        Math.random() * 4 + 3 // length of string 3-7 
    )
    
    for (let i = 0; i < value; ++i) {
        if (!letter || letter == 0) {
            const first_rand = Math.round(
                Math.random()
            )
    
            const bag = {
                0: () => {
                    result += vowel(true)
                },
                1: () => {
                    result += consonant()
                }
            }
    
            bag[first_rand] && bag[first_rand]()
        }
        else if (letter == 1) {
            result += consonant()
        }
        else if (letter == 2) {
            result += vowel()
        }
    }
    
    return result
}

// add events for server
server.on('connection', connection_to_server)
