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
                            if (a.result == '0') {
                                user.data.id = '',
                                user.data.nickname = '',
                                user.data.password = '',
                            
                                data.write_user_data(),
                                
                                window.location.reload()
                            }
                            else {
                                user.data.nickname = a.nick

                                data.write_user_data()
                            }
                            break

                        case 'do_friends':
                            a.result == '0' ? web.notice('no_user') : web.notice('wait_for_confirmation')
                            break

                        case 'list_of_friends':
                            data.main('get_friends', a.data)
                            web.load_friend()
                            break

                        case 'new_message':
                            web.get_message(a.data)
                            break
                    }
                }

                auth(user.data.id, user.data.password, true)
            }
        }
        else { window.location.reload() }
    }
    ws.onclose = () => {
        // reconnection
        setTimeout(
            () => {
                main()
            },
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
 * @param {string} type
 * @param {{}} content
 */
const send_data = (type, content) => {
    if (user.status == 'offline') {
        web.notice('off_server')
    }
    else {
        ws.send(
            JSON.stringify( {type, content} )
        )
    }
}

/**
 * send id and password for auth
 * @param {string} id
 * @param {string} password
 * @param {bool} a
 */
 const auth = (id, password, a=false) => {
    send_data(
        'auth',
        {
            connect: a,
            id,
            password
        }

    )
}

module.exports = {connect, auth, send_data}
