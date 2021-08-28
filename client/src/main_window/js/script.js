// import modules
const fs = require('fs')
const crypto = require('crypto')
const data = require('../js/data')
const load = require('../js/load')
const web = require('../js/web')
const connection = require('../js/ws')

// send id and password for auth
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
let hashing = str => {
    return crypto.scryptSync(str, str, 32).toString('hex')
}

// send data to server
// input Object (type: str, content: {})
let send_data = data => {
    user.status == 'offline' ?
        web.notice('off_server')
        :
        ws.send(
            JSON.stringify(data)
        )
}

// WebSocket
let ws

// info about user and his 'people'
let user = {
    status: 'offline',
    isNewUser: false,
    isConnection_closed: false,
    data: JSON.parse(
        fs.readFileSync('./src/data/user.json')
    )
}

// checking authorization of user
user.data.id == "" || user.data.nickname == "" || user.data.password == "" ?
    user.isNewUser = true
: ''
