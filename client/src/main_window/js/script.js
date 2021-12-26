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

// import modules
const data = require('../js/data')
const load = require('../js/load')
const web = require('../js/web')
const cipher = require('../js/cipher')
const connection = require('../js/ws')
let ws // WebSocket

// WebSocket
connection.main()

/**
 * send id and password for auth
 * @param {string} id
 * @param {string} password
 * @param {bool} a
 */
const auth = (id, password, a=false) => {
    send_data(
        {
            type: 'auth',
            content: {
                connect: a,
                id,
                password
            }
        }
    )
}

// input Object (type: str, content: {})
/**
 * send data to server
 * @param {{
 * type: string,
 * content: {}
 * }} data 
 */
const send_data = data => {
    if (user.status == 'offline') {
        web.notice('off_server')
    }
    else {
        ws.send(
            JSON.stringify(data)
        )
    }
}

// info about user and his 'people'
const user = {
    status: 'offline',
    isNewUser: false,
    isConnection_closed: false,
    friend: {
        activeFriend: undefined,
        id: undefined,
        key: undefined
    },
    data: data.get_info()
}

// checking authorization of user
if (user.data.id == ""
    || user.data.nickname == ""
    || user.data.password == ""
) {
    user.isNewUser = true
}
else{
    user.key = cipher.rsa.import_private()
}