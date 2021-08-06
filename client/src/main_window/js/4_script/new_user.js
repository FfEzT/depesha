const main = document.getElementsByClassName('background')[0]
let bg = document.createElement('div')
bg.style = 'position: absolute; width: 100vw; height: 100vh;\
            background-color: var(--color_1); opacity: 0;\
            transition: opacity .5s cubic-bezier(0.16, 1, 0.3, 1);'

main.append(bg)
setTimeout(
    ()=>{
        bg.style.opacity = '100'
    },
    10
)
setTimeout(
    ()=>{
        document.getElementsByClassName('close')[0].remove()
        document.getElementsByClassName('up_panel')[0].remove()
        document.getElementsByClassName('left_panel')[0].remove()
        document.getElementsByClassName('right_panel')[0].remove()
        bg.remove()

        user.status == 'online'?
            // online
            !function(){
                    let grid = document.createElement('div'),
                        name = document.createElement('input'),
                        password = document.createElement('input'),
                        sign_in = document.createElement('div'),
                        sign_up = document.createElement('div')

                    let grid_ = document.createElement('div'),
                        id = document.createElement('input'),
                        password_ = document.createElement('input'),
                        back = document.createElement('div'),
                        sign_in_ = document.createElement('div')
                        
                    let style = {
                            grid: "position: absolute;\
                                        display: grid;\
                                        top: 50vh;\
                                        left: 50vw;\
                                        width: min(30vw, 40vh);\
                                        height: min(23vw, 30vh);\
                                        transform: translate(-50%,300%);\
                                        transition: transform 1s cubic-bezier(0.68, -0.5, .25, 1.25);\
                                        grid-template-columns: 1fr 1.5fr;\
                                        grid-template-rows: repeat(3, 1fr);\
                                        grid-template-areas:'name name'\
                                                            'password password'\
                                                            'sign_in sign_up';",
                            name: 'grid-area: name;\
                                        background: none;\
                                        border-bottom: 1px #4A47A3 solid;\
                                        margin: min(1vw, 2vh);\
                                        color: var(--color_text);\
                                        font-family: \'text\';\
                                        padding: 0 5%;\
                                        font-size: min(2.5vw, 4vh);',
                            password: 'grid-area: password;\
                                        background: none;\
                                        border-bottom: 1px #4A47A3 solid;\
                                        margin: min(1vw, 2vh);\
                                        color: var(--color_text);\
                                        font-family: \'text\';\
                                        padding: 0 5%;\
                                        font-size: min(2.5vw, 4vh);',
                            text: 'grid-area: sign_in;\
                                        margin: auto;\
                                        cursor: pointer;\
                                        font-family: text;\
                                        font-size: min(1vw, 2vh);\
                                        color: var(--color_text);\
                                        user-select: none;',
                            btn: 'grid-area: sign_up;\
                                        background-color: var(--color_btn);\
                                        margin: 10%;\
                                        display: grid;\
                                        border-radius: var(--border_round_2);\
                                        cursor: pointer;'
                    } 
                    let can_creat = {
                        id: false,
                        password: false
                    }

                    grid.style     = grid_.style     = style.grid
                    name.style     = id.style        = style.name
                    password.style = password_.style = style.password
                    sign_in.style  = back.style      = style.text
                    sign_up.style  = sign_in_.style  = style.btn
                    
                    name.placeholder = 'nickname'
                    id.placeholder = 'id'
                    password.placeholder = password_.placeholder ='password'

                    name.maxLength = '15'
                    id.maxLength = '7'
                    password.maxLength = password_.maxLength = '20'

                    name.spellcheck = id.spellcheck = false

                    name.onblur = ()=>{
                        let a = /^[a-zA-Z0-9]{3,15}$/
                        let b = /^\d{3,15}$/
                        let text = name.value
                        
                        !b.test(text)? 
                            a.test(text)?
                                can_creat.name = true: (can_creat.name = false, notice('sign_in_name'))
                        :
                            (
                                can_creat.name = false,
                                notice('sign_in_name')
                            )
                    }
                    password.onblur = () => {
                        let a = /^\S{9,20}$/
                        let text = password.value

                        a.test(text)?
                            can_creat.password = true 
                        :   
                            (
                                can_creat.password = false,
                                notice('sign_in_password')
                            )
                    }

                    sign_in.onclick = ()=>{
                        grid.style.transform = 'translate(-325%, -50%)'
                        
                        grid_.style.transform = 'translate(-50%, -50%)'
                    }
                    sign_up.onclick = ()=>{
                        user.status == 'online'?
                            can_creat.name && can_creat.password ? 
                                !function(){
                                    let data_for_sending = {
                                        type: 'sign_up',
                                        content: {
                                            name    : name.value,
                                            password: password.value
                                        }
                                    }
                                    data_for_sending = JSON.stringify(data_for_sending)

                                    ws.send(data_for_sending)
                                }()
                            : 
                                notice('sign_up_err') 
                        :
                            notice('off_server')
                    }
                    back.onclick = ()=>{
                        grid.style.transform = 'translate(-50%, -50%)'
                        
                        grid_.style.transform = 'translate(275%, -50%)'
                    }
                    sign_in_.onclick = ()=>{
                        // checking password
                        let a = /^\S{9,20}$/
                        a.test(password_.value)?
                            (
                                auth(id.value, password_.value),
                                ws.onmessage = e => {
                                    let b = JSON.parse(e.data)
                                    if(b.result == '1'){
                                        // id, nick, password = null, reload
                                        user.data.id = id.value
                                        user.data.nick = b.nick
                                        user.data.password = password_.value
                            
                                        fs.writeFileSync(
                                            './src/data/user.json',
                                            JSON.stringify(user.data)
                                        )
                            
                                        window.location.reload()
                                    }
                                    else if(b.result == '0'){
                                        notice('auth_err')
                                    }
                                }
                            )
                        : notice('sign_up_err')
                    }
                    
                    password.type = password_.type = 'password'
            
                    sign_in.innerText = 'Есть аккаунт'
                    back.innerText = 'Назад'

                    sign_up.innerHTML = '<div\
                                        style="margin: auto;\
                                            color: var(--color_text);\
                                            font-size: min(1.3vw, 2.2vh);\
                                            font-family: text;\
                                            user-select: none">\
                                        Создать аккаунт</div>'
                    sign_in_.innerHTML = '<div\
                                        style="margin: auto;\
                                            color: var(--color_text);\
                                            font-size: min(1.3vw, 2.2vh);\
                                            font-family: text;\
                                            user-select: none">\
                                        Войти</div>'
                    
                    grid_.style.transform = 'translate(275%, -50%)'

                    main.append(grid, grid_)
                    grid.append(name, password, sign_in, sign_up)
                    grid_.append(id, password_, back, sign_in_)

                    setTimeout(
                        () => {
                            grid.style.transform = 'translate(-50%,-50%)'
                        },
                        100
                    );
            }()
        :
            // offline
            !function(){
                    let offline = document.createElement('div')
                    offline.style = 
                        'position: absolute;\
                        left: 0vw;\
                        top: 0vh;\
                        height: 100vh;\
                        width: 100vw;\
                        display: grid'

                    offline.innerHTML = '<div\
                                            id="offline"\
                                            style="margin: auto;\
                                            font-size: min(8vw, 15vh);\
                                            font-family: text;\
                                            color: var(--color_text);\
                                            opacity: 0; transform: scale(0);\
                                            transition: opacity 1s cubic-bezier(0.42,0,0.58,1),\
                                            transform 1s cubic-bezier(0.34,1.56,0.64,1);\
                                            user-select: none;">\
                                            offline\
                                        </div>'

                    main.append(offline)
                    
                    setTimeout(
                        () => {
                            let el = document.getElementById('offline')
                            el.style.opacity = '100'
                            el.style.transform = 'scale(1)'
                        }, 
                        100
                    );
            }();
    },
    250
)
