"use strict"

// import modules
const fs = require('fs')
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
let auth = (id, password, a=false) => {
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
let send_data = data => {
    user.status == 'offline' ? web.notice('off_server') : (
        ws.send(
            JSON.stringify(data)
        )
    )
}

// info about user and his 'people'
let user = {
    status: 'offline',
    isNewUser: false,
    isConnection_closed: false,
    friend: {
        activeFriend: undefined,
        id: undefined,
        key: undefined
    },
    data: JSON.parse(
        fs.readFileSync('./src/data/user.json')
    )
}

// checking authorization of user
user.data.id == "" || user.data.nickname == "" || user.data.password == "" ? (
        user.isNewUser = true
) : (
    user.key = cipher.rsa.import_private(
        fs.readFileSync('./src/data/private.key')
    )
)
