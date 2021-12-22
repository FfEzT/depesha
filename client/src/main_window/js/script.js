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

// send id and password for auth
// in: str, str, bool
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

// send data to server
// input Object (type: str, content: {})
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
user.data.id == "" || user.data.nickname == "" || user.data.password == "" ? (
        user.isNewUser = true
) : (
    user.key = cipher.rsa.import_private()
)
