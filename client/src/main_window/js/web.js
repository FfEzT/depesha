"use strict"

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
// checking whether the panel is fixed or not
// in: str(leftBar || rightBar || down_panel)
// out: boolean (true || false)
let check_pos_for_bars = str => {
    return document.getElementById(str).classList.contains('focus')
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
// in: boolean(true/false)
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
    // type: int (default: 5000)
    const time = 5000

    // for editting text and resize text
    let bag = {
        'off_work': () => {
            text = 'В мире мало фиксиков, поэтому эта кнопка пока не работает'
        },
        'btn_more': () => {
            text = 'В будущем эта кнопка спасет ваш компьютер...'
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
        },
        'it_is_u': () => {
            text = 'Простите не узнал... это же вы...)'
        },
        'wait': () => {
            text = 'Подождите, программа не зависла'
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
        },
        'idle': () => {
            user.status = 'online'
        }
    }
    
    a[user.status] && a[user.status]()

    change_status()

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
    let a = /^[a-zA-Z]{3,10}$/
    let b = search_friend.value.toLowerCase()

    if(b == user.data.id){
        notice('no_user')
        setTimeout(
            () => notice('it_is_u'),
            1500
        )
        search_friend.value = ''
        return
    }
    
    a.test(b)?
        (
            send_data(
                {
                    type: 'do_friend',
                    content: {
                        status: 'search',
                        from: user.data.id,
                        to: b
                    }
                }
            ),
            search_friend.value = ''
        )
        : notice('no_user')
}

let load_friend = () => {
    let Friend = require('../js/Friend')

    let temp = [...document.getElementsByClassName('el')]
    temp && !function(){
        for(let i = 0; i < temp.length; i++){
            temp[i].remove()
        }
    }()

    // type: array(list of friends)
    data.main().forEach(
        value => {
            friends[value.id] = new Friend(value.id, value.nickname, value.status)
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

// choose friend to chat with him
// in: str(nickname of your friend)
let chooseFriend = str => {
    // todo render messages
    !function(){
        user.activeFriend = str
        
        let messages = JSON.parse(
            fs.readFileSync('./src/data/message.key')
        )
        // todo for(let i = messages.length; i >= 0; i--){}
    }()

    // change nicname in right panel
    !function(){
        document.getElementsByClassName('nick_text')[0].innerText = str
    }()

    // open right panel
    !function(){
        !check_pos_for_bars('rightBar') && set_pos_for_bars('rightBar')
    }()

    // open down panel
    !function(){
        !check_pos_for_bars('down_panel') && set_pos_for_bars('down_panel')
    }()

    // todo check redPoint
    !function(){}()
}

let friends = {}

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
    add_friend,
    chooseFriend
}
