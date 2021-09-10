"use strict"

let main = () => {
    ws = new WebSocket('ws://localhost:5480') // todo change str

    ws.onopen = () => {
        user.isConnection_closed?
            window.location.reload()
            :
            !function(){
                user.status = 'online'
                try{
                    web.change_status()
                }
                catch (error){}

                // sign in
                !user.isNewUser && (
                    ws.onmessage = e => {
                        // data from server
                        // type: {Object}
                        let a = JSON.parse(e.data)
            
                        // like switch(){}
                        let bag = {
                            'auth': () => {
                                a.result == '0' ?
                                    (
                                        // id, nickname, password = null, reload
                                        user.data.id = '',
                                        user.data.nickname = '',
                                        user.data.password = '',
                                    
                                        fs.writeFileSync(
                                            './src/data/user.json',
                                            JSON.stringify(user.data)
                                        ),
                                        
                                        window.location.reload()
                                    )
                                    :
                                    (
                                        user.data.nickname = a.nick,
                                        fs.writeFile(
                                            './src/data/user.json',
                                            JSON.stringify(user.data),
                                            () => {}
                                        )
                                    )
                            },
                            'do_friends': () => {
                                a.result == '0' ?
                                    web.notice('no_user')
                                    :
                                    (
                                        web.notice('wait_for_confirmation')
                                    )
                            },
                            'list_of_friends': () => {
                                data.main('get_friends', a.data)
                                web.load_friend()
                            }
                        }
                        bag[a.type] && bag[a.type]()
                    },
                    auth(user.data.id, user.data.password, true)
                )
            }()
    }
    ws.onclose = () => {
        // reconnection every 10 sec
        setTimeout(
            () => {
                main()
            },
            10000
        );

        !user.isConnection_closed && !function(){
            user.isConnection_closed = true
            web.notice('off_server')
            user.status = 'offline'
            
            try{
                web.change_status()
            }
            catch (error){}
        }()
    }
}

module.exports = {main}