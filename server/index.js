const ws = require('ws')
const server = new ws.Server(
    {port: 5480}
)

let sign_up = (content)=>{
    // todo
    console.log(content)
}

let connection_to_server = e => {
    e.on(
        'message',
        (data)=>{
            data = JSON.parse(data)

            let cases = {
                'sign_up': () => {sign_up(data.content)},
            }
            cases[data.type] && cases[data.type]()
        }
    )
}

server.on('connection', connection_to_server)
