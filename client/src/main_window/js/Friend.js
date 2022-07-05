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

class Friend {
    constructor(nickname, id, status, key, red_point=false) {
        this.nickname = nickname
        this.id = id
        this.status = status
        this.key = key
        this.has_new_message = red_point

        this.render()
    }

    // show friend in down_panel
    render = () => {
        // type: html element
        this.a = document.createElement('div')
        this.a.classList.add('friend')

        this.checking_status()
    }
    checking_status = () => {
        if (this.status == 'friend') this.show_friend()
        else if (this.status == 'pending' || 'waiting') this.show_application()
    }
    show_friend = () => {
        this.a.innerHTML = `
                <div class="el">
                    <div class="picture">
                        <div class="red_point" style="transform: scale(0)"></div>
                    </div>
                </div>
                <div class="el" onclick="web.notice('off_work')">
                    <div class="nickname">${this.nickname + '#' + this.id}</div>
                </div>
                <div class="el" onclick="web.notice('off_work')">
                    <div class="button call"></div>
                </div>
                <div class="el" onclick="web.chooseFriend('${this.nickname}', ${this.id}, '${this.key}')">
                    <div class="button chat"></div>
                </div>
                <div class="el" onclick="web.delete_friend('${this.nickname}', ${this.id})">
                    <div class="button delete"></div>
                </div>`
        this.tab1.append(this.a)
        this.has_new_message && this.red_point.set()
    }
    show_application = () => {
        this.status == 'pending'? this.show_pending() : this.show_waiting()

        this.a.style.gridTemplateColumns = 'min(3.375vw, 6vh) auto repeat(2, min(3.375vw, 6vh) )'
        this.tab2.append(this.a)
    }
    show_pending = () => {
        this.a.innerHTML = `
            <div class="el">
                <div class="picture"></div>
            </div>
            <div class="el" onclick="web.notice('off_work')">
                <div class="nickname">${this.nickname + '#' + this.id}</div>
            </div>
            <div class="el" onclick="web.add_friend('${this.nickname}', ${this.id})">
                <div class="button add_friend"></div>
            </div>
            <div class="el" onclick="web.delete_friend('${this.nickname}', ${this.id})">
                <div class="button delete"></div>
            </div>`
    }
    show_waiting = () => {
        this.a.innerHTML = `
            <div class="el">
                <div class="picture"></div>
            </div>
            <div class="el" onclick="web.notice('off_work')">
                <div class="nickname">${this.nickname + '#' + this.id}</div>
            </div>
            <div class="el" onclick="web.delete_friend('${this.nickname}', ${this.id})" style="grid-column: 3/5;">
                <div class="button delete"></div>
            </div>`
    }
    red_point = {
        there_is: false,
        set: () => {
            if (!this.red_point.there_is) {
                this.a.getElementsByClassName('red_point')[0].style.transform = "scale(1)"
                this.red_point.there_is = true
            }
        },
        delete: () => {
            if (this.red_point.there_is) {
                this.a.getElementsByClassName('red_point')[0].style.transform = "scale(0)"
                this.red_point.there_is = false
            }
        }
    }
    setStatus = status => {
        const element = this.a.querySelector('.el > .picture')

        switch (status) {
            case 'online':
                element.classList.remove('online')
                element.classList.remove('idle')
                element.classList.add('online')
                break

            case 'idle':
                element.classList.remove('online')
                element.classList.remove('idle')
                element.classList.add('idle')
                break

            case 'offline':
                element.classList.remove('online')
                element.classList.remove('idle')
                break
        }
    }

    // type: HTML element
    tab1 = document.getElementsByClassName('content_for_f1')[0]
    tab2 = document.getElementsByClassName('content_for_f2')[0]
}

module.exports = Friend
