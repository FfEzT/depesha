let main = () => {
    web.notice('welcome')

    !function(){
        setTimeout(
            () => {
                start.style.opacity = 0
            },
            10
        )
        setTimeout(
            () => {
                start.remove()
            },
            1000
        )
    }()

    user.isNewUser && !function(){
        require('../js/new_user')
        setTimeout(
            () => {
                web.notice('auth')
            },
            1500
        )
    }()
    
    // WebSocket
    connection.main()

    // loading list of friends
    web.load_friend()

    // final
    console.log('ready') // todo u can delete this line
}

module.exports = {main}