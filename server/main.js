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


const ws = require('ws')

const ididentifier = require('./id.js')
const db = require('./data.js')

const PORT = process.env.PORT || 5480

// list of connected clients
const clients = {}

const server = new ws.Server(
    {port: PORT}
)

/**
 *
 * @param {ws} e
 * @param {string} type
 * @param {{}} data
 */
const send = (e, type, content) => {
    e.send(
        JSON.stringify( {type, content} )
    )
}

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
        send(
            e,
            type,
            {result: 0}
        )
    }

    e.on(
        'message',
        data => {
            data = JSON.parse(data)

            switch (data.type) {
                case 'sign_up':
                    // data.content = {nickname, password, public_key}
                    sign_up(e, data.content)
                    break

                case 'auth':
                    // data.content = {connect, nickname, id, password}
                    auth(e, data.content, notice_incorrect_data)
                    break

                case 'update_status':
                    // data.content = {id, nickname, password}
                    db.people.update_status(data.content.nickname, data.content.id, data.content.status)
                    break

                case 'get_friends':
                    send_friends(data.content.nickname + '#' + data.content.id)
                    break

                case 'do_friend':
                    do_friend(e, data.content, notice_incorrect_data)
                    break

                case 'message_to_friend':
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
    const id = await ididentifier.generate_id(content.nickname)

    if (id < 1000) {
        db.people.sign_up(content.nickname, id, content.password, content.public_key).then(
            () => {
                send(
                    e,
                    'new_user',
                    {
                        result: 1,
                        id
                    }
                )
            }
        )
        db.friends.create_list(content.nickname + '#' + id)
    }
    else send(e, 'new_user', {result: 0} )
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
    const people = await db.people.get_user(content.nickname, content.id)
    const type = 'auth'

    if (people && people.password === content.password) {
        send(
            e,
            type,
            {
                result: 1,
                nick: people.nickname
            }
        )

        if (content.connect) {
            db.people.update_status(content.nickname, content.id, 'online')
            clients[content.nickname + '#' + content.id] = e

            e.on(
                'close',
                () => {
                    db.people.update_status(content.nickname, content.id, 'offline')
                    delete clients[content.nickname + '#' + content.id]
                }
            )

            send_new_friends_and_messages: {
                if (people.changes_friends == 1) {
                    send_friends(content.nickname + '#' + content.id)

                    db.people.update_friends(content.nickname, content.id, 0)
                }
                if (people.new_message == 1) {
                    db.temp_mail.get(content.nickname + '#' + content.id).then(
                        data => {
                            send(e, 'new_message', data)
                        }
                    )
                    db.people.update_new_message(content.nickname, content.id, 0)
                }
            }

        }
    }
    else f(type)
}

/**
 * send list of friends to client
 * @param {string} id nickname#1234
 */
const send_friends = async id => {
    send(
        clients[id],
        'list_of_friends',
        await db.friends.get_friends(id)
    )
}

/**
 * @param {WebSocket} e
 * @param {{}} content
 * @param {Function} f notice_incorrect_data
 */
const do_friend = (e, content, f) => {
    /**
     * @param {string} nickname
     * @param {number} id
     */
    const update_friend_list_client = (nickname, id) => {
        const name = nickname + '#' + id

        if ( clients[name] ) {
            send_friends(name)
        }
        else db.people.update_friends(nickname, id, 1)
    }

    switch (content.status) {
        case 'search':
            db.people.get_user(content.friend_nickname, content.friend_id).then(
                user => {
                    if (user) {
                        db.friends.write(
                            content.sender_nickname + '#' + content.sender_id,
                            content.friend_nickname,
                            content.friend_id,
                            'waiting'
                        )
                        .then(
                            () => {
                                db.friends.write(
                                    content.friend_nickname + '#' + content.friend_id,
                                    content.sender_nickname,
                                    content.sender_id,
                                    'pending'
                                )

                                send_friends(content.sender_nickname + '#' + content.sender_id)
                                update_friend_list_client(content.friend_nickname, content.friend_id)

                                send(
                                    e,
                                    'do_friends',
                                    {result: 0}
                                )
                            }
                        )
                        .catch( () => f('do_friends') )
                    }
                    else f('do_friends')
                }
            )
            break

        case 'add':
            db.friends.add_friend(
                content.sender_nickname + '#' + content.sender_id,
                content.friend_nickname,
                content.friend_id
            )
            .then(
                () => {
                    db.friends.add_friend(
                        content.friend_nickname + '#' + content.friend_id,
                        content.sender_nickname,
                        content.sender_id,
                    )
                    .then(
                        () => {
                            send_friends(content.sender_nickname + '#' + content.sender_id)
                            update_friend_list_client(content.friend_nickname, content.friend_id)
                        }
                    )
                }
            )
            break

        case 'delete':
            db.friends.delete_friend(
                content.sender_nickname + '#' + content.sender_id,
                content.friend_nickname,
                content.friend_id
            )
            .then(
                () => {
                    db.friends.delete_friend(
                        content.friend_nickname + '#' + content.friend_id,
                        content.sender_nickname,
                        content.sender_id
                    )
                    .then(
                        () => {
                            send_friends(content.sender_nickname + '#' + content.sender_id)
                            update_friend_list_client(content.friend_nickname, content.friend_id)
                        }
                    )
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
    const sender = data.sender_nickname + '#' + data.sender_id

    const man = clients[data.friend_nickname + '#' + data.friend_id]

    if (man) {
        send(
            men,
            'new_message',
            [
                {
                    sender,
                    time: data.time,
                    content: data.content
                }
            ]
        )
    }
    else {
        db.people.update_new_message(
            data.friend_nickname,
            data.friend_id,
            1
        )
        db.temp_mail.set(
            data.friend_nickname + '#' + data.friend_id,
            data.sender_nickname + '#' + data.sender_id,
            data.time,
            data.content
        )
    }
}

// add events for server
server.on('connection', connection_to_server)
