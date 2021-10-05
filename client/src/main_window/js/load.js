let main = () => {
    //todo delete
    web.set_pos_for_bars('rightBar')

    web.notice('welcome')

    user.isNewUser?
        !function(){
            require('../js/new_user')
            setTimeout(
                () => {
                    web.notice('auth')
                },
                1500
            )
        }()
        :
        !function(){
            //loading list of friends
            web.load_friend()
        }();

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

    //final
    console.log('ready') //todo u can delete this line
}

module.exports = {main}