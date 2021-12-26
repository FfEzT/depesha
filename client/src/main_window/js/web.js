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

// import electron module
const {ipcRenderer} = require('electron')

// window's btns
const close_window = () => { ipcRenderer.send("close_window") }
const full_window = () => { ipcRenderer.send('max_window') }
const minimize_window = () => { ipcRenderer.send("minimize_window") }

// list of friend in down panel
const friends = {}

/**
 * @param {string} lr leftBar || rightBar || down_panel
 */
const set_pos_for_bars = lr => {
    const el = document.getElementById(lr)
    const isOpen = el.classList.contains('focus')

    isOpen? el.classList.remove('focus') : el.classList.add('focus')
}
/**
 * checking whether the panel is fixed or not
 * @param {string} str leftBar || rightBar || down_panel
 * @returns {bool}
 */
const check_pos_for_bars = str => {
    return document.getElementById(str).classList.contains('focus')
}
const roll_down_all = () => {
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

const hot_key = e => {
    switch (a.keyCode) {
        // space
        case 32:
            document.getElementById('rightBar').classList.contains('focus') && chat.focus()
            break

        // arrow left
        case 37:
            set_pos_for_bars('leftBar')
            break

        // arrow up
        case 38:
            roll_down_all()
            break

        // arrow right
        case 39:
            set_pos_for_bars('rightBar')
            break

        // arrow down
        case 40:
            set_pos_for_bars('down_panel')
            break
    }
}

/**
 * for serching
 * @param {string} key focus||blur
 */
const focus_blur = key => {
    switch (key) {
        case 'focus':
            document.querySelector('body').setAttribute('onkeyup', '')
            break
            
        case 'blur':
            document.querySelector('body').setAttribute('onkeyup', 'web.hot_key(event)')
            break
    }
}
/**
 * @param {bool} arg 
 */
const focusBlur_right_bar = arg => {
    const el = document.getElementById('rightBar')

    arg? el.classList.add('focus') : el.classList.remove('focus')

    focus_blur(arg? 'focus':'blur')
}

/**
 * create notice in app (top-left)
 * @param {string} a
 */
const notice = a => {
    // it set time for removing notice
    const DELAY = 5000

    const wow = document.getElementsByClassName('notice')[0]
    let text, size

    // for editing and resizing text
    switch (a) {
        case 'off_work':
            text = 'В мире мало фиксиков, поэтому эта кнопка пока не работает'
            break

        case 'btn_more':
            text = 'В будущем эта кнопка спасет ваш компьютер...'
            break

        case 'welcome':
            text = 'Привет ;)'
            size = 'min(1.5vw,3vh)'
            break

        case 'off_server':
            text = 'Что-то не так... вы не подключены к серверу('
            break

        case 'sign_up_err':
            text = 'Пожалуйста, заполните поля как следует ;)'
            size = 'min(1vw, 1.7vh)'
            break

        case 'sign_in_name':
            text = 'Минимум 3 символа (на английском) и не только из цифр'
            break

        case 'sign_in_password':
            text = 'Пароль должен состоять минимум из 9 символов'
            break

        case 'auth':
            text = 'Вам нужно авторизоваться'
            size = 'min(1vw, 1.8vh)'
            break

        case 'auth_err':
            text = 'Хм, я не помню вас, возможно, вы ввели неправильные данные'
            break

        case 'no_user':
            text = 'Я не нашел такого пользователя...('
            size = 'min(0.7vw, 1.3vh)'
            break

        case 'wait_for_confirmation':
            text = 'Я отправил запрос, ждите, пока не примут заявку'
            break

        case 'it_is_u':
            text = 'Простите не узнал... это же вы...)'
            break

        case 'wait':
            text = 'Подождите, программа не зависла'
            break

        case 'empty_message':
            text = 'Зачем вы хотите отправить воздух?'
            break

        case 'empty_adress':
            text = 'Кому выхотите это отправить?'
            break

        case 'new_message':
            text = 'О, у вас новое сообщение!'
            break
    }

    const go = document.createElement('div')
    go.classList.add('message', 'close')

    const go_text = document.createElement('div')
    go_text.classList.add('text')

    size? go_text.style.fontSize = size : ''

    go.prepend(go_text)
    go_text.innerHTML = text

    if ( document.getElementsByClassName('first')[0] ) {
        if ( document.getElementsByClassName('second')[0] ) {
            if ( document.getElementsByClassName('left')[0] ) {
                document.getElementsByClassName('left')[0].remove()
            }

            document.getElementsByClassName('second')[0].classList.add('left')
        }

        document.getElementsByClassName('first')[0].classList.replace('first', 'second')
    }

    wow.append(go)

    setTimeout(
        () => {
            go.classList.replace('close', 'first')
        },
        50
    )
    setTimeout(
        () => {
            go.classList.add('left')
            setTimeout(
                () => {
                    go.remove()
                },
                500
            ) 
        },
        DELAY
    )
}

const change_status = () => {
    const object = document.getElementById('status')
    const text_of_object = document.getElementById('text_of_status')

    switch (user.status) {
        case 'online':
            object.style.backgroundColor = '#35B8E7'
            text_of_object.innerText = 'online'
            break
        
        case 'offline':
            object.style.backgroundColor = 'var(--color_text)'
            text_of_object.innerText = 'offline'
            break

        case 'idle':
            object.style.backgroundColor = '#F033AE'
            text_of_object.innerText = 'idle'
            break
    }
}
const change_status_from_profile = () => {
    const a = {
        'online': () => {
            user.status = 'idle'
        },
        'idle': () => {
            user.status = 'online'
        }
    }
    switch (user.status) {
        case 'online':
            user.status = 'idle'
            break

        case 'idle':
            user.status = 'online'
            break
    }

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

const f_search_friend = () => {
    const a = /^[a-zA-Z]{3,10}$/
    const b = search_friend.value.toLowerCase()

    if (b == user.data.id) {
        notice('no_user')
        setTimeout(
            () => notice('it_is_u'),
            1500
        )
        search_friend.value = ''
        return 0
    }
    
    if ( a.test(b) ) {
        send_data(
            {
                type: 'do_friend',
                content: {
                    status: 'search',
                    from: user.data.id,
                    to: b
                }
            }
        )
        search_friend.value = ''}
    else { notice('no_user') }
}

const load_friend = () => {
    const Friend = require('../js/Friend')
    const list = data.red_point.open_file().new_message

    let temp = [...document.getElementsByClassName('el')]
    if (temp) {
        for (let i = 0; i < temp.length; ++i) {
            temp[i].remove()
        }
    }

    // type: array(list of friends)
    data.main().forEach(
        value => {
            friends[value.id] = new Friend(value.id, value.nickname, value.status, value.key, list[value.id])
        }
    )
}

/**
 * send request to delete friend to server
 * @param {string} str id of friend, who we want to delete
 */
const delete_friend = str => {
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

/**
 * send request to add friend to server
 * @param {string} str id of friend, who we want to add
 */
const add_friend = str => {
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

/**
 * choose friend to chat with him
 * @param {string} str nickname of friend
 * @param {string} id id of friend
 * @param {string} key key of friend
 */
const chooseFriend = (str, id, key) => {
    /**
     * open panel
     * @param {string} a rightBar || down_panel
     */
    const open_panels = a => {
        !check_pos_for_bars(a) && set_pos_for_bars(a)
    }

    // delete old list
    document.getElementsByClassName('chat')[0].innerHTML = ''

    // load messages from file
    {
        user.friend.activeFriend = str
        user.friend.id = id
        user.friend.key = key

        const messages = data.message.get(id)
        const win = document.getElementsByClassName('chat')[0]
        win.onscroll = 0

        if (messages) {
            let index_of_messages = messages.length - 1

            // send obj to render
            const f = () => {
                if (index_of_messages >= 0) {
                    if (win.scrollTop <= 300) {
                        renderMessage(messages[index_of_messages], 'load')
                        --index_of_messages
                        f()
                    }
                    else {
                        win.onscroll = () => {
                            if (win.scrollTop <= 300 && index_of_messages >= 0) {
                                renderMessage(messages[index_of_messages], 'load', true)
                                --index_of_messages
                                f()
                            }
                        }
                    }
                }
            }
            f()
        }
    }

    // change nickname in right panel
    document.getElementsByClassName('nick_text')[0].innerText = str

    // open panels
    {
        open_panels('rightBar')
        open_panels('down_panel')
    }

    // delete redPoint
    friends[id].red_point.delete()
    // delete redPoint in files
    data.red_point.delete(id)
}
/**
 * show message in right panel
 * @param {{
 * content, time, who_send
 * }} data 
 * @param {string} type 'newMessage' || 'load'
 * @param {bool} without_scroll
 */
const renderMessage = (data, type, without_scroll) => {
    const a = document.getElementsByClassName('chat')[0]
    const b = document.createElement('div')

    const time = new Date(data.time)
    const out_time = {
        year  : time.getFullYear(),
        month : time.getMonth(),
        day   : time.getDate(),
        hour  : time.getHours(),
        minute: time.getMinutes()
    }

    b.classList.add('block')
    b.innerHTML = `
        <div class="time">${out_time.hour} : ${out_time.minute}    ${out_time.day}.${out_time.month}.${out_time.year}</div>
        <div class="from"></div>
        <div class="message">${data.content}</div>
    `

    if (data.who_send == 'i') {
        setTimeout(
            () => {
                b.children[1].style.backgroundColor = 'var(--color_text)'
            },
            10
        )
    }

    if (type == 'newMessage') {
        a.append(b)
    }
    else if (type == 'load') {
        a.prepend(b)
    }

    !without_scroll && a.scrollTo(
        {
            top: a.scrollHeight
        }
    )

    setTimeout(
        () => {
            b.style.opacity = 100
        },
        10
    )
}

const send_message = () => {
    if (user.friend.id) {
        const input = chat.value.trim()

        if (input != '') {
            if (user.status != 'offline') {
                const time = new Date().toUTCString()

                // send data to server
                send_data(
                    {
                        type: 'message_to_friend',
                        content: {
                            who: user.data.id,
                            to: user.friend.id,
                            time,
                            content: cipher.rsa.encrypt(input, user.friend.key)
                        }
                    }
                )

                // write your message
                {
                    data.message.write(
                        user.friend.id,
                        {
                            content: input,
                            time,
                            who_send: 'i'
                        }
                    )
                }

                // render message
                {
                    renderMessage(
                        {
                            content: input,
                            time,
                            who_send: 'i'
                        },
                        'newMessage'
                    )
                }

                chat.value = ''
            }
            else { notice('off_server') }
        }
        else { notice('empty_message') }
    }
    else { notice('empty_adress') }
}

// processing incoming messages from the server
// in: arr of obj (messages)
const get_message = arr => {
    arr.forEach(
        el => {
            // who, time, content
            const from = el.who
            const content = cipher.rsa.decrypt(el.content)
            const time = el.time
            const who_send = 'friend'

            setTimeout(
                () => {
                    data.message.write(
                        from,
                        {
                            content,
                            time,
                            who_send
                        }
                    )
                },
                1
            )

            if (user.friend.id == from) {
                renderMessage(
                    {content, time, who_send},
                    'newMessage'
                )
            }
            else {
                notice('new_message'),
                friends[from].red_point.set(),
                data.red_point.set(from)
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
    add_friend,
    chooseFriend,
    send_message,
    get_message
}
