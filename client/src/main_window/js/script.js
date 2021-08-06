// todo: remove line under before package
// !@ts-check
console.time('starting') // todo delete
// load program
let load = () => {
    notice('welcome')

    user.isNewUser && !function(){
        require('../js/4_script/new_user')
        setTimeout(
            () => {
                notice('auth')
            },
            1300
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
                        auth(user.data.id, user.data.password),
                        ws.onmessage = e => {
                            let a = JSON.parse(e.data)

                            a.result == '0' && !function(){
                                // id, nick, password = null, reload
                                user.data.id = ''
                                user.data.nick = ''
                                user.data.password = ''
                    
                                fs.writeFileSync(
                                    './src/data/user.json',
                                    JSON.stringify(user.data)
                                )
                    
                                window.location.reload()
                            }()
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
    console.log('ready')
    console.timeEnd('starting') // todo delete
}

// import modules
const fs = require('fs')
const { join } = require('path')
let ws // WebSocket

// send id and password for auth
function auth(id, password){
    ws.send(
        JSON.stringify(
            {
                type: 'auth',
                content: {id, password}
            }
        )
    )
}

// info about user and his 'people'
let user = {
    status: 'offline',
    microphone: true, // todo delete
    headphone: true, // todo delete
    isNewUser: false,
    isConnection_closed: false,
    data: JSON.parse(
        fs.readFileSync('./src/data/user.json')
    )
}
let people

// checking authorization of user
user.data.id == "" || user.data.nick == "" || user.data.password == "" ?
    user.isNewUser = true
:
    people = JSON.parse(
        fs.readFileSync('./src/data/people.json')
    )
