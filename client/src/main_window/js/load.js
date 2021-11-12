let main = () => {
    web.notice('welcome')

    user.isNewUser? (
        require('../js/new_user'),
        setTimeout(
            () => {
                web.notice('auth')
            },
            1500
        )
    ) : (
        // loading list of friends
        web.load_friend()
    )

    // load animation
    {
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
    }

    // final
    console.log('ready') // todo u can delete this line
}

module.exports = {main}