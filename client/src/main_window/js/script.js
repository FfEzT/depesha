// import modules
const fs = require('fs')
const data = require('../js/data')
let load = require('../js/load')
let web = require('../js/web')
let connection = require('../js/ws')
let ws // WebSocket

// send id and password for auth
let auth = (id, password, a=false) => {
    ws.send(
        JSON.stringify(
            {
                type: 'auth',
                content: {
                    connect: a,
                    id,
                    password
                }
            }
        )
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
