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
/**
 * @type {{nickname#1234: number}}
 */
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
                    // data.content = {id, nickname, status}
                    updateStatus(data.content.nickname, data.content.id, data.content.status)
                    break

                case 'get_friends':
                    send_friends(data.content.nickname, data.content.id, e)
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
    if (id < 9999) {
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
            // update status for friends
            updateStatus(content.nickname, content.id, 'online')

            clients[content.nickname + '#' + content.id] = e

            e.on(
                'close',
                () => {
                    // update status for friends
                    updateStatus(content.nickname, content.id, 'offline')
                    delete clients[content.nickname + '#' + content.id]
                }
            )

            send_new_friends_and_messages: {
                if (people.changes_friends == 1) {
                    send_friends(content.nickname, content.id)

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
 * @param {string} nickname
 * @param {number} id
 * @param {WebSocket} e
 */
const send_friends = async (nickname, id, e=undefined) => {
    const name = nickname + '#' + id
    send(
        e || clients[name],
        'list_of_friends',
        await db.friends.get_friends(name)
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
        if ( clients[nickname + '#' + id] ) send_friends(nickname, id)
        else db.people.update_friends(nickname, id, 1)
    }

    const sender = content.sender_nickname + '#' + content.sender_id
    const friend = content.friend_nickname + '#' + content.friend_id

    switch (content.status) {
        case 'search':
            db.people.get_user(content.friend_nickname, content.friend_id)
            .then(
                user => {
                    if (user) {
                        db.friends.write(
                            sender,
                            content.friend_nickname,
                            content.friend_id,
                            'waiting'
                        )
                        .then(
                            async () => {
                                await db.friends.write(
                                    friend,
                                    content.sender_nickname,
                                    content.sender_id,
                                    'pending'
                                )

                                send_friends(content.sender_nickname, content.sender_id, e)
                                update_friend_list_client(content.friend_nickname, content.friend_id)

                                send(
                                    e,
                                    'do_friends',
                                    {result: 1}
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
                sender,
                content.friend_nickname,
                content.friend_id
            )
            .then(
                () => {
                    db.friends.add_friend(
                        friend,
                        content.sender_nickname,
                        content.sender_id,
                    )
                }
            )
            .then(
                () => {
                    send_friends(content.sender_nickname, content.sender_id, e)
                    update_friend_list_client(content.friend_nickname, content.friend_id)
                }
            )
            break

        case 'delete':
            db.friends.delete_friend(
                sender,
                content.friend_nickname,
                content.friend_id
            )
            .then(
                () => {
                    db.friends.delete_friend(
                        friend,
                        content.sender_nickname,
                        content.sender_id
                    )
                    .then(
                        () => {
                            send_friends(content.sender_nickname, content.sender_id, e)
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
    const friend = data.friend_nickname + '#' + data.friend_id

    const man = clients[friend]

    if (man) {
        send(
            man,
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
            friend,
            sender,
            data.time,
            data.content
        )
    }
}

/**
 * update status of user's network and send info his friends
 * @param {string} nick 
 * @param {string} id 
 * @param {string} status online/offline/idle
 */
const updateStatus = async (nick, id, status) => {
    db.people.update_status(nick, id, status)

    const friends = await db.friends.get_friends(nick + '#' + id)

    for (const item of friends) {
        const temp = item.nickname + '#' + item.id

        if ( clients[temp] && item.status == 'friend' )
            send(
                clients[temp],
                'friendsStatus',
                {who: data.content.nickname + '#' + data.content.id, status: data.content.status}
            )
    }
}

// add events for server
server.on('connection', connection_to_server)
