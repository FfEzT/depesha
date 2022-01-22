const http = require('http')
const websocket = require('ws')
const fs = require('fs')

const PORT = process.env.PORT || 5480

const readfile = (filename) => {
    return fs.readFileSync('./src/web/'+filename)
}

const server = http.createServer(
    (request, response) => {
        if (request.method == 'GET') {
            switch (request.url) {
                case '/':
                    response.end( readfile('index.html') )
                    break

                case '/style.css':
                    response.end( readfile('style.css') )
                    break

                case '/main.js':
                    response.end( readfile('main.js') )
                    break

                case '/Nunito-ExtraLight.ttf':
                    response.end( readfile('Nunito-ExtraLight.ttf') )
                    break

                case '/favicon.ico':
                    response.end('')
                    break

                default: response.end('Where are You?')
            }
        }
        else {
            response.end('Where are You?')
        }
    }
)

server.listen(
    PORT,
    () => console.log('port -> ', PORT)
)


const ws = new websocket.Server( {server} )

const users = {} // id: ws

const create_id = () => {
    const vowel = a => {
        const str = 'yuiiooaaeee'

        letter = a? 1 : 0
    
        const rand = Math.round(
            Math.random() * (str.length - 1)
        )

        return str[rand]
    }
    const consonant = () => {
        const str = 'ttttnnnssshhrrddllccmmwwffggppbbvvkkxjqz'
    
        letter = 2
    
        const rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    
    let letter, result = ''
    let value = Math.round(
        Math.random() * 4 + 3 // length of string 3-7 
    )
    
    for (let i = 0; i < value; ++i) {
        if (!letter || letter == 0) {
            const first_rand = Math.round(
                Math.random()
            )
    
            const bag = {
                0: () => {
                    result += vowel(true)
                },
                1: () => {
                    result += consonant()
                }
            }
    
            bag[first_rand] && bag[first_rand]()
        }
        else if (letter == 1) {
            result += consonant()
        }
        else if (letter == 2) {
            result += vowel()
        }
    }

    if ( users[result] ) {
        return create_id()
    }
    else {
        return result
    }
}

const send = (e, type, data) => {
    e.send(
        JSON.stringify(
            {type, data}
        )
    )
}

const auth = e => {
    const id = create_id()

    users[id] = e

    send(e, 'auth', id)

    e.on(
        'close',
        () => {
            delete users[id]
            send_list()
        }
    )
}

const send_list = () => {
    const list = []

    for (const i in users) list.push(i)

    for (const e in users) {
        send( users[e], 'list', list)
    }
}

const connect_to_server = e => {
    e.on(
        'message',
        message => {
            message = JSON.parse(message)
            
            switch (message.type) {
                case 'auth':
                    auth(e)
                    send_list()
                    break

                case 'ice':
                    send(
                        users[message.data.to],
                        'new_ice',
                        {
                            data: message.data.data,
                            from: message.data.from
                        }
                    )
                    break

                case 'offer':
                    send(
                        users[message.data.to],
                        'new_offer',
                        {
                            from: message.data.from,
                            offer: message.data.offer
                        }
                    )
                    break

                case 'answer':
                    send(
                        users[message.data.to],
                        'new_answer',
                        message.data.answer
                    )
                    break

                case 'calling':
                    delete users[message.data]
                    send_list()
                    break
            }
        }
    )
}

ws.on('connection', connect_to_server)
