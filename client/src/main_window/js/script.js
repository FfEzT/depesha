// import modules
const fs = require('fs')
const data = require('../js/data')
let load = require('../js/load')
let web = require('../js/web')
let connection = require('../js/ws')
let ws // WebSocket

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
