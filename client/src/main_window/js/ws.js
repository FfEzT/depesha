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

// time in ms
const TIME_FOR_RECONNECT = 10000

const connect = () => {
    /**
     * if u sign up there is a problem for change status in profile
     */
    const trycatch = () => {
        try {
            web.change_status()
        }
        catch (error) {}
    }

    ws = new WebSocket('ws://localhost:5480') // todo change str

    ws.onopen = () => {
        if (!user.isConnection_closed) {
            user.status = 'online'
            trycatch()

            // sign in
            if (!user.isNewUser) {
                ws.onmessage = e => {
                    /**
                     * data from server
                     * @type {{}}
                     */
                    const a = JSON.parse(e.data)

                    switch (a.type) {
                        case 'auth':
                            if (a.content.result == 0) {
                                user.data.id = '',
                                user.data.nickname = '',
                                user.data.password = '',

                                data.write_user_data(),

                                window.location.reload()
                            }
                            else {
                                if (user.data.nickname != a.content.nick) {
                                    user.data.nickname = a.content.nick
                                    data.write_user_data()
                                }
                            }
                            break

                        case 'do_friends':
                            a.content.result == 1 ? web.notice('wait_for_confirmation') : web.notice('no_user')
                            break

                        case 'list_of_friends':
                            data.main('set_friends', a.content)
                            web.load_friend()
                            break

                        case 'new_message':
                            web.get_message(a.content)
                            break
                    }
                }

                auth(
                    user.data.nickname,
                    user.data.id,
                    user.data.password,
                    true
                )
            }
        }
        else window.location.reload()
    }
    ws.onclose = () => {
        // reconnection
        setTimeout(
            () => connect(),
            TIME_FOR_RECONNECT
        )

        if (!user.isConnection_closed) {
            user.isConnection_closed = true
            web.notice('off_server')
            user.status = 'offline'

            trycatch()
        }
    }
}

/**
 * send data to server
 * @param {{type: string,content: {}}} data
 */
const send_data = data => {
    if (user.status == 'offline') web.notice('off_server')
    else ws.send( JSON.stringify(data) )
}

/**
 * send id and password for auth
 * @param {string} id nickname
 * @param {number} nickname
 * @param {string} password
 * @param {bool} final_identification
 */
const auth = (id, nickname, password, final_identification=false) => {
    send_data(
        {
            type: 'auth',
            content: {
                connect: final_identification,
                id,
                nickname,
                password
            }
        }
    )
}

module.exports = {connect, auth, send_data}
