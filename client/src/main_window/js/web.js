// import modules
const wnd = require('electron').remote.getCurrentWindow()

// window's btns
const close_window = () => wnd.close()
const full_window = () => wnd.isMaximized()?
    wnd.unmaximize() : wnd.maximize()
const minimize_window = () => wnd.minimize()

// 'leftBar' OR 'rightBar'
let set_pos_for_bars = lr => {
    const el = document.getElementById(lr) 
    let isOpen = el.classList.contains('focus')

    isOpen?
        el.classList.remove('focus') : el.classList.add('focus')
}
let roll_down_all = () => {
    const lBar = document.getElementById('leftBar')
    const rBar = document.getElementById('rightBar')
    
    const lIsOpen = lBar.classList.contains('focus')
    const rIsOpen = rBar.classList.contains('focus')

    lIsOpen && set_pos_for_bars('leftBar')
    rIsOpen && set_pos_for_bars('rightBar')
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
    let update = () => {
        ws.send(
            JSON.stringify(
                {
                    type: 'update_status',
                    content: {
                        id: user.data.id,
                        status: user.status
                    }
                }
            )
        )
    }

    let a = {
        'online': () => {
            user.status = 'idle'
            update()
            change_status()
        },
        'offline': () => {
            notice('off_server')
        },
        'idle': () => {
            user.status = 'online'
            update()
            change_status()
        }
    }
    a[user.status] && a[user.status]()
}
let f_search_friend = () => {
    let a = /^[a-zA-Z0-9]{3,15}$/
    let b = /^\d{3,15}$/
    
    !b.test(search_friend.value)? 
        a.test(search_friend.value)?
            (
                ws.send(
                    JSON.stringify(
                        {
                            type: 'do_friend',
                            content: {
                                status: 'search',
                                from: user.data.id,
                                to: search_friend.value
                            }
                        }
                    )
                ),
                search_friend.value = ''
            )
            : notice('no_user')
        : notice('no_user')
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
    f_search_friend
}