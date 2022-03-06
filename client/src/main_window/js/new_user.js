/*
 * This file is part of Depesha.

 * Depesha is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Depesha is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with Depesha.  If not, see <https://www.gnu.org/licenses/>.
*/

// delete old info (list of friends, key, messages)
data.main('delete_data')
data.red_point.to_null()
data.key_to_null()
data.message.message_to_null()

const main = document.getElementById('background')

document.getElementsByClassName('close')[0].remove()
document.getElementsByClassName('up_panel')[0].remove()
document.getElementsByClassName('left_panel')[0].remove()
document.getElementsByClassName('right_panel')[0].remove()
document.getElementsByClassName('down_panel')[0].remove()


const load_form_sign_up = () => {
    offline.remove()

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
                        transform: translate(-50%,50%);\
                        transition: transform 1s cubic-bezier(0.68, -0.5, .25, 1), opacity .25s cubic-bezier(0.42,0,0.58,1);\
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
    const can_create = {
        id: false,
        password: false
    }

    grid.style     = grid_.style     = style.grid
    name.style     = id.style        = style.name
    password.style = password_.style = style.password
    sign_in.style  = back.style      = style.text
    sign_up.style  = sign_in_.style  = style.btn
    
    grid_.style.opacity = '0'
    grid.style.opacity = '0'

    grid_.style.transform = 'translate(50%, -50%)'

    grid.style.transition = 'transform 1s cubic-bezier(0.68, -0.5, .25, 1), opacity 1s cubic-bezier(0.42,0,0.58,1)'

    name.placeholder = 'nickname'
    id.placeholder = 'id'
    password.placeholder = password_.placeholder ='password'

    name.maxLength = '15'
    id.maxLength = '7'
    password.maxLength = password_.maxLength = '20'

    name.spellcheck = id.spellcheck = false

    name.tabIndex = '1'
    password.tabIndex = '2'
    id.tabIndex = '-1'
    password_.tabIndex = '-1'

    name.onblur = () => {
        const a = /^[a-zA-Z0-9]{3,15}$/
        const b = /^\d{3,15}$/
        let text = name.value

        if ( !b.test(text) ) {
            if ( a.test(text) ) {
                can_create.name = true
            }
            else {
                can_create.name = false
                web.notice('sign_in_name')
            }
        }
        else {
            can_create.name = false
            web.notice('sign_in_name')
        }
    }
    password.onblur = () => {
        let a = /^\S{9,20}$/
        let text = password.value

        if ( a.test(text) ) {
            can_create.password = true
        }
        else {
            can_create.password = false
            web.notice('sign_in_password')
        }
    }

    sign_in.onclick = () => {
        grid.style.opacity = '0'
        grid_.style.opacity = '100'

        grid.style.transform = 'translate(-150%, -50%)' 
        grid_.style.transform = 'translate(-50%, -50%)'

        name.tabIndex = '-1'
        password.tabIndex = '-1'
        id.tabIndex = '1'
        password_.tabIndex = '2'
    }
    back.onclick = () => {
        grid.style.opacity = '100'
        grid_.style.opacity = '0'

        grid.style.transform = 'translate(-50%, -50%)'
        grid_.style.transform = 'translate(50%, -50%)'
        
        name.tabIndex = '1'
        password.tabIndex = '2'
        id.tabIndex = '-1'
        password_.tabIndex = '-1'
    }
    sign_up.onclick = () => {
        if (can_create.name && can_create.password) {
            setTimeout(
                () => {
                    let hash = cipher.hashing(password.value)
                    let key = cipher.rsa.create_private(
                        cipher.hashing(hash)
                    )

                    data.write_key(key)
                    
                    ws.onmessage = e => {
                        let a = JSON.parse(e.data)

                        if (a.result == 1) {
                            // write data about user (user.json)
                            user.data.id = a.id
                            user.data.nickname = name.value
                            user.data.password = cipher.hashing(password.value)
                        
                            data.write_user_data()
                            
                            // show id
                            let bg = document.createElement('div')

                            bg.style = 'position: absolute; width: 100vw; height: 100vh;\
                            background-color: var(--color_1); opacity: 0;\
                            transition: opacity .5s cubic-bezier(0.16, 1, 0.3, 1);'
                            main.append(bg)
                            setTimeout(
                                () => {
                                    bg.style.opacity = '100'
                                },
                                10
                            )
                            
                            let grid_info_id = document.createElement('div')
                            grid_info_id.style = "position: absolute;\
                                                display: grid;\
                                                top: 50vh;\
                                                left: 50vw;\
                                                width: min(30vw, 40vh);\
                                                height: min(23vw, 30vh);\
                                                opacity: 0;\
                                                transform: translate(-50%, -50%);\
                                                transition: opacity 1s cubic-bezier(0.42,0,0.58,1);\
                                                grid-template-rows: repeat(3, 1fr);"
                            main.append(grid_info_id)
                            
                            setTimeout(
                                () => {
                                    bg.remove()
                                    grid.remove()
                                    grid_.remove()
                                    grid_info_id.style.opacity = '100'
                                },
                                500
                            )
                            
                            let info_text = document.createElement('div')
                            info_text.style = 'width: 100%;\
                                            height: 55%;\
                                            margin: auto;\
                                            color: var(--color_text);\
                                            font-family: text;\
                                            font-size: min(2.5vw, 4vh);\
                                            padding: 0 5%;\
                                            user-select: none;\
                                            border-bottom: 1px solid rgb(74, 71, 163);'
                            info_text.innerText = 'Ваш id:'
                            
                            let info_id = document.createElement('div')
                            info_id.style = 'width: 100%;\
                                            height: 55%;\
                                            margin: auto;\
                                            color: var(--color_text);\
                                            font-family: text;\
                                            font-size: min(2.5vw, 4vh);\
                                            padding: 0 5%;\
                                            border-bottom: 1px solid rgb(74, 71, 163);'
                            info_id.innerText = a.id
                            
                            let info_btn = document.createElement('div')
                            info_btn.style = 'width: 40%;\
                                            display: grid;\
                                            height:56%;\
                                            margin: auto;\
                                            background-color: var(--color_btn);\
                                            border-radius: var(--border_round_2);\
                                            cursor: pointer;'
                            info_btn.innerHTML = '<div style="margin:auto;\
                                                font-family: text;\
                                                font-size: min(2.5vw, 4vh);\
                                                color: var(--color_text);\
                                                user-select: none">ok</div>'
                            
                            
                            grid_info_id.append(info_text)
                            grid_info_id.append(info_id)
                            grid_info_id.append(info_btn)
                            
                            info_btn.onclick = () => {
                                window.location.reload()
                            }
                        }
                    }

                    server.send_data(
                        'sign_up',
                        {
                            nickname: name.value,
                            password: hash,
                            public_key: cipher.rsa.create_public(key)
                        }
                    )
                },
                300
            )
            web.notice('wait')
        }
        else { web.notice('sign_up_err') }
    }
    sign_in_.onclick = () => {
        // checking password
        const a = /^\S{9,20}$/

        if ( a.test(password_.value) ) {
            ws.onmessage = e => {
                let b = JSON.parse(e.data)
                if (b.result == '1') {
                    setTimeout(
                        () => {
                            let hash = cipher.hashing(password_.value)
                            let key_to_write = cipher.rsa.create_private(
                                cipher.hashing(hash)
                            )
                            // write data about user (user.json)
                            user.data.id = id.value
                            user.data.nickname = b.nick
                            user.data.password = hash

                            data.write_user_data()
                            data.write_key(key_to_write)

                            ws.onmessage = e => {
                                let a = JSON.parse(e.data)
                                data.main('get_friends', a.data)
                            
                                window.location.reload()
                            }

                            server.send_data(
                                'get_friends',
                                {
                                    id: user.data.id
                                }
                            )
                        },
                        300
                    )
                    web.notice('wait')
                }
                else if (b.result == '0') {
                    web.notice('auth_err')
                }
            }
            server.auth(
                id.value,
                cipher.hashing(password_.value)
            )
        }
        else { web.notice('sign_up_err') }
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

    main.append(grid, grid_)
    grid.append(name, password, sign_in, sign_up)
    grid_.append(id, password_, back, sign_in_)

    setTimeout(
        () => {
            grid.style.transform = 'translate(-50%,-50%)'
            grid.style.transition = 'transform 1s cubic-bezier(0.68, -0.5, .25, 1), opacity .25s cubic-bezier(0.42,0,0.58,1)'
            grid.style.opacity = '100'
        },
        100
    );
}
const checking_status = () => {
    if (user.status == 'online'){
        load_form_sign_up()
    }
    else if (user.isConnection_closed) {}
    else {
        setTimeout(
            checking_status,
            5000
        )
    }
}

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

const el = document.getElementById('offline')
el.style.opacity = '100'
el.style.transform = 'scale(1)'

checking_status()
