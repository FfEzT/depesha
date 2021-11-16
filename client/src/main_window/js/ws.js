const main = () => {
    const trycatch = () => {
        try {
            web.change_status()
        }
        catch (error) {}
    }

    ws = new WebSocket('ws://localhost:5480') // todo change str

    ws.onopen = () => {
        !user.isConnection_closed? (
            !function() {
                user.status = 'online'
                trycatch()

                // sign in
                !user.isNewUser && (
                    ws.onmessage = e => {
                        // data from server
                        // type: {Object}
                        const a = JSON.parse(e.data)
            
                        // like switch(){}
                        const bag = {
                            'auth': () => {
                                a.result == '0' ? (
                                    // id, nickname, password = null, reload
                                    user.data.id = '',
                                    user.data.nickname = '',
                                    user.data.password = '',
                                
                                    data.write_user_data(),
                                    
                                    window.location.reload()
                                ) : (
                                    user.data.nickname = a.nick,
                                    
                                    data.write_user_data()
                                )
                            },
                            'do_friends': () => {
                                a.result == '0' ? web.notice('no_user') : web.notice('wait_for_confirmation')
                            },
                            'list_of_friends': () => {
                                data.main('get_friends', a.data)
                                web.load_friend()
                            },
                            'new_message': () => {
                                web.get_message(a.data)
                            }
                        }
                        bag[a.type] && bag[a.type]()
                    },
                    auth(user.data.id, user.data.password, true)
                )
            }()
        ) : window.location.reload()
    }
    ws.onclose = () => {
        // reconnection every 10 sec
        setTimeout(
            () => {
                main()
            },
            10000
        );

        !user.isConnection_closed && !function() {
            user.isConnection_closed = true
            web.notice('off_server')
            user.status = 'offline'
            
            trycatch()
        }()
    }
}

module.exports = {main}