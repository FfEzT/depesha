// import modules
const fs = require('fs')
const data = require('../js/data')
let ws // WebSocket

// after load program
let load = () => {
    notice('welcome')

    user.isNewUser && !function(){
        require('../js/new_user')
        setTimeout(
            () => {
                notice('auth')
            },
            1300 // ? why 1300 ms
        )
    }()

    // WebSocket
    !function connection(){
        ws = new WebSocket('ws://localhost:5480') // todo change str

        ws.onopen = () => {
            user.isConnection_closed?
                window.location.reload()
            :
                !function() {
                    user.status = 'online'
                    change_status()

                    // sign in
                    !user.isNewUser && (
                        auth(user.data.id, user.data.password, true),
                        ws.onmessage = e => {
                            let a = JSON.parse(e.data)

                            a.result == '0' ?
                                !function(){
                                    // id, nickname, password = null, reload
                                    user.data.id = ''
                                    user.data.nickname = ''
                                    user.data.password = ''
                        
                                    fs.writeFileSync(
                                        './src/data/user.json',
                                        JSON.stringify(user.data)
                                    )
                        
                                    window.location.reload()
                                }()
                            :(
                                user.data.nickname = a.nick,
                                fs.writeFile(
                                    './src/data/user.json',
                                    JSON.stringify(user.data),
                                    () => {}
                                )
                            )
                        }
                    ) 
                }()
        }
        ws.onclose = () => {
            // reconnection every 10 sec
            setTimeout(
                () => {
                    connection()
                }, 10000
            );

            !user.isConnection_closed && !function(){
                user.isConnection_closed = true
                notice('off_server')
                user.status = 'offline'
                change_status()
            }()
        }
    }();

    // final
    console.log('ready') // todo u can delete this line
}

// send id and password for auth
function auth(id, password, a=false){
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
