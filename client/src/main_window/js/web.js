// import modules
const wnd = require('electron').remote.getCurrentWindow()

// window's btns
const close_window = () => wnd.close()
const full_window = () => wnd.isMaximized()?
    wnd.unmaximize() : wnd.maximize()
const minimize_window = () => wnd.minimize()

// input: str(leftBar || rightBar || down_panel)
let set_pos_for_bars = lr => {
    const el = document.getElementById(lr) 
    let isOpen = el.classList.contains('focus')

    isOpen?
        el.classList.remove('focus') : el.classList.add('focus')
}
let roll_down_all = () => {
    const lBar = document.getElementById('leftBar')
    const rBar = document.getElementById('rightBar')
    const dBar = document.getElementById('down_panel')
    
    const lIsOpen = lBar.classList.contains('focus')
    const rIsOpen = rBar.classList.contains('focus')
    const dIsOpen = dBar.classList.contains('focus')

    lIsOpen && set_pos_for_bars('leftBar')
    rIsOpen && set_pos_for_bars('rightBar')
    dIsOpen && set_pos_for_bars('down_panel')
}

let hot_key = e => {
    let a = {
        // arrow left
        37: () => {
                set_pos_for_bars('leftBar')
        },
        // arrow right
        39: () => {
                set_pos_for_bars('rightBar')
        },
        // arrow up
        38: () => {
                roll_down_all()
        },
        // arrow down
        40: () => {
            set_pos_for_bars('down_panel')
        },
        // space
        32: () => {
                document.getElementById('rightBar').classList.contains('focus') && document.getElementById('chat').focus()
        }
    }

    a[e.keyCode] && a[e.keyCode]()
}

// for serching
let focus_blur = on => {
    let a = {
        'focus': () => {
            document.querySelector('body').setAttribute('onkeyup', '')
        },
        'blur': () => {
            document.querySelector('body').setAttribute('onkeyup', 'web.hot_key(event)')
        }
    }
    a[on] && a[on]()
}
let focusBlur_right_bar = arg => {
    const el = document.getElementById('rightBar')
    arg?
        el.classList.add('focus')
        :
        el.classList.remove('focus')
    focus_blur(arg? 'focus':'blur')
}

// create notice in app (top-left)
// input: str (there are values in var bag)
let notice = a => {
    const wow = document.getElementsByClassName('notice')[0]
    let text, size

    // it set time for removing notice
    // type: int (dafault: 5000)
    const time = 5000

    // for editting text and resize text
    let bag = {
        'off_work': () => {
            text = 'В мире мало фиксиков, поэтому эта кнопка пока не работает'
        },
        'btn_more': () => {
            text = 'Разрабам не хватило бюджета, чтобы доделать эту кнопку...'
        },
        'welcome': () => {
            text = 'Привет ;)'
            size = 'min(1.5vw,3vh)'
        },
        'off_server': () => {
            text = 'Что-то не так... вы не подключены к серверу('
        },
        'sign_up_err': () => {
            text = 'Пожалуйста, заполните поля как следует ;)'
            size = 'min(1vw, 1.7vh)'
        },
        'sign_in_name': () => {
            text = 'Минимум 3 символа (на английском) и не только из цифр'
        },
        'sign_in_password': () => {
            text = 'Пароль должен состоять минимум из 9 символов'
        },
        'auth': () => {
            text = 'Вам нужно авторизоваться'
            size = 'min(1vw, 1.8vh)'
        },
        'auth_err': () => {
            text = 'Хм, я не помню вас, возможно вы ввели неправильные данные'
        },
        'no_user': () => {
            text = 'Я не нашел такого пользователя...('
            size = 'min(0.7vw, 1.3vh)'
        },
        'wait_for_confirmation': () => {
            text = 'Я отправил запрос, ждите пока не примут заявку'
        }
    }
    bag[a] && bag[a]()

    const go = document.createElement('div')
    go.classList.add('message', 'close')

    const go_text = document.createElement('div')
    go_text.classList.add('text')
    size?
        go_text.style.fontSize = size : ''
    go.prepend(go_text)
    go_text.innerHTML = text

    // todo u can remake this part of the code
    document.getElementsByClassName('first')[0]? (
        document.getElementsByClassName('second')[0]? (
            document.getElementsByClassName('left')[0]? (
                document.getElementsByClassName('left')[0].remove()
            ):'',
            document.getElementsByClassName('second')[0].classList.add('left')
        ):'',
        document.getElementsByClassName('first')[0].classList.replace('first', 'second')
    ):'';

    wow.append(go)

    setTimeout(
        () => {
            go.classList.replace('close', 'first')
        }, 10
    )
    setTimeout(
        () => {
            go.classList.add('left')
            setTimeout(
                ()=>{
                    go.remove()
                },
                500
            ) 
        },
        time
    )
}

let change_status = () => {
    const object = document.getElementById('status')
    const text_of_object = document.getElementById('text_of_status')

    let a = {
        'online': () => {
            object.style.backgroundColor = '#35B8E7'
            text_of_object.innerText = 'online'
        },
        'offline': () => {
            object.style.backgroundColor = 'var(--color_text)'
            text_of_object.innerText = 'offline'
        },
        'idle': () => {
            object.style.backgroundColor = '#F033AE'
            text_of_object.innerText = 'idle'
        }
    }
    a[user.status] && a[user.status]()
}
let change_status_from_profile = () => {
    let a = {
        'online': () => {
            user.status = 'idle'
            change_status()
        },
        'idle': () => {
            user.status = 'online'
            change_status()
        }
    }
    a[user.status] && a[user.status]()

    send_data(
        {
            type: 'update_status',
            content: {
                id: user.data.id,
                status: user.status
            }
        }
    )
}

let f_search_friend = () => {
    user.status == 'offline'?
        notice('off_server')
        :
        !function(){
            let a = /^[a-zA-Z0-9]{3,15}$/
            let b = /^\d{3,15}$/
            
            !b.test(search_friend.value)? 
                a.test(search_friend.value)?
                    (
                        send_data(
                            {
                                type: 'do_friend',
                                content: {
                                    status: 'search',
                                    from: user.data.id,
                                    to: search_friend.value
                                }
                            }
                        ),
                        search_friend.value = ''
                    )
                    : notice('no_user')
                : notice('no_user')
                }()
}

let load_friend = () => {
    // type: HTML element
    let tab1 = document.getElementsByClassName('content_for_f1')[0]
    let tab2 = document.getElementsByClassName('content_for_f2')[0]

    // type: array(list of friends)
    let arr = data.main()

    arr.forEach(
        (value, index) => {
            // type: html element
            let a = document.createElement('div')
            a.classList.add('el')

            if(value.status == 'friend'){
                a.innerHTML = `
                            <div class="ell">
                                <div class="center picture"></div>
                            </div>
                            <div class="ell">
                                <div class="center nickname" onclick="web.notice('off_work')">${value.nickname}</div>
                            </div>
                            <div class="ell e" onclick="web.notice('off_work')">
                                <div class="button center call"></div>
                            </div>
                            <div class="ell e" onclick="web.notice('off_work')">
                                <div class="button center chat"></div>
                            </div>
                            <div class="ell e" onclick="web.delete_friend('${value.id}')">
                                <div class="button center delete"></div>
                            </div>`

                tab1.append(a)

                return
            }
            if(value.status == 'pending' || value.status == 'waiting'){
                value.status == 'pending'?
                    (               
                        a.style.gridTemplateColumns = '.5fr 1fr 2fr .25fr .25fr',                 
                        a.innerHTML = `
                        <div class="ell">
                            <div class="center picture"></div>
                        </div>
                        <div class="ell e">
                            <div class="center nickname u">${value.id}</div>
                        </div>
                        <div class="ell">
                            <div class="center nickname u">${value.nickname}</div>
                        </div>
                        <div class="ell e" onclick="web.add_friend('${value.id}')">
                            <div class="button center add_friend"></div>
                        </div>
                        <div class="ell e" onclick="web.delete_friend('${value.id}')">
                            <div class="button center delete_application"></div>
                        </div>`
                    )
                    :
                    (
                        a.style.gridTemplateColumns = '.5fr 1fr 1fr .5fr',
                        a.innerHTML = `
                        <div class="ell">
                            <div class="center picture"></div>
                        </div>
                        <div class="ell e">
                            <div class="center nickname u">${value.id}</div>
                        </div>
                        <div class="ell">
                            <div class="center nickname u">${value.nickname}</div>
                        </div>
                        <div class="ell e" onclick="web.delete_friend('${value.id}')">
                            <div class="button center delete_application"></div>
                        </div>`
                    )

                tab2.append(a)

                return
            }
        }
    )
}

// send request to delete friend to server
// input: str(id of friend, who we want to delete)
let delete_friend = str => {
    send_data(
        {
            type: 'do_friend',
            content: {
                status: 'delete',
                from: user.data.id,
                to: str
            }
        }
    )
}

// send request to add friend to server
// input: str(id of friend, who we want to add)
let add_friend = str => {
    send_data(
        {
            type: 'do_friend',
            content: {
                status: 'add',
                from: user.data.id,
                to: str
            }
        }
    )
}

module.exports = {
    close_window,
    full_window,
    minimize_window,
    set_pos_for_bars,
    roll_down_all,
    hot_key,
    focus_blur,
    focusBlur_right_bar,
    notice,
    change_status,
    change_status_from_profile,
    f_search_friend,
    load_friend,
    delete_friend,
    add_friend
}
