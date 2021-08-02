// todo: remove line under before package
// !@ts-check

// load program
let load = () => {
    notice('welcome')

    user.isNewUser?
        require('../js/4_script/new_user')
    :
        // checking status
        change_status()

    // final
    console.log('ready')
}

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
            document.querySelector('body').setAttribute('onkeyup', 'hot_key(event)')
        }
    }
    a[on] && a[on]()
}
let focusBlur_right_bar = arg => {
    const el = document.getElementById('rightBar')
    arg?
        el.classList.add('focus'):el.classList.remove('focus')
    focus_blur(arg? 'focus':'blur')
}

let notice = a => {
    const wow = document.getElementsByClassName('notice')[0]
    let text, size

    // for editting text and resize text
    let bag = {
        'off_work': () => {
            text = 'У нас дефицит фиксиков, поэтому эта кнопка пока не работает'
        },
        'btn_more': () => {
            text = 'Нам не хватило бюджета, чтобы доделать эту кнопку...'
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
        },
        'sign_in_name': () => {
            text = 'Минимум 3 символа (на английском) и не только из цифр'
        },
        'sign_in_password': () => {
            text = 'Пароль должен состоять минимум из 9 символов'
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
        ()=>{
            go.classList.replace('close', 'first')
        },0
    )
    setTimeout(
        ()=>{
            go.classList.add('left')
            setTimeout(
                ()=>{
                    go.remove()
                },500
            ) 
        },
        5000
    )
}

// todo удалить
let off = element => {
    switch (element) {
        case 'mic':
            user.microphone? (
                document.getElementsByClassName(element)[0].style.backgroundImage = 'url(materials/picture/off_microphone.svg)'
            ):(
                document.getElementsByClassName(element)[0].style.backgroundImage = 'url(materials/picture/microphone.svg)'
            )
            user.microphone = !user.microphone
            break;
    
        case 'headphone':
            user.headphone? (
                document.getElementsByClassName(element)[0].style.backgroundImage = 'url(materials/picture/off_sound.svg)'
            ):(
                document.getElementsByClassName(element)[0].style.backgroundImage = 'url(materials/picture/sound.svg)'
            )
            user.headphone = !user.headphone
            break;
    }
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
        'offline': () => {
            change_status()
            notice('off_server')
        },
        'idle': () => {
            user.status = 'online'
            change_status()
        }
    }
    a[user.status] && a[user.status]()
}

// import modules
const wnd = require('electron').remote.getCurrentWindow()
const fs = require('fs')
let ws

// info about user and his 'people'
let user = {
    status: 'offline',
    microphone: true,
    headphone: true,
    isNewUser: false,
    isConnection_closed: false,
    data: JSON.parse(fs.readFileSync('./src/data/user.json'))
}
let people

// window's btns
const close_window = () => wnd.close()
const full_window = () => wnd.isMaximized()?
    wnd.unmaximize() : wnd.maximize()
const minimize_window = () => wnd.minimize()

// WebSocket
!function connection(){
    ws = new WebSocket('ws://localhost:5480') // todo change str

    ws.onopen = () => {
        user.isConnection_closed?
            window.location.reload()
        :
            !function () {
                user.status = 'online'
            }()
    }
    ws.onclose = () => {
        setTimeout(
            () => {
                connection()
            }, 10000
        );

        !user.isConnection_closed && !function(){
            user.isConnection_closed = true
            notice('off_server')
            user.status = 'offline'
            change_status()
        }()
    }
}();

// checking authorization of user
(user.data.id == "" || user.data.nick == "" || user.data.password == "")?
    user.isNewUser = true
:
    people = JSON.parse(
        fs.readFileSync('./src/data/people.json')
    );