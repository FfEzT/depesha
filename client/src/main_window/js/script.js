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
const server = require('../js/ws')
const name_parser = require('../js/name_parser')
const Friend = require('../js/Friend')

// WebSocket
let ws = {}
server.connect()

// info about user and his 'people'
const user = {
    status: 'offline',
    isNewUser: false,
    isConnection_closed: false,
    friend: {
        nickname: undefined,
        id: undefined,
        key: undefined
    },
    data: data.data_user.get()
}

// checking authorization of user
if (user.data.id == '' ||
    user.data.nickname == '' ||
    user.data.password == ''
) {
    user.isNewUser = true
}
else user.key = cipher.rsa.import_private()