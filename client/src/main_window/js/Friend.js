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
    constructor(id, nickname, status, key, red_point=false) {
        this.id = id
        this.nickname = nickname
        this.status = status
        this.key = key
        this.has_new_message = red_point

        this.render()
    }

    // show friend in down_panel
    render = () => {
        // type: html element
        this.a = document.createElement('div')
        this.a.classList.add('el')

        this.checking_status()
    }
    checking_status = () => {
        if (this.status == 'friend') {
            this.show_friend()
        }
        else if (this.status == 'pending' || 'waiting') {
            this.show_application()
        }
    }
    show_friend = () => {
        this.a.innerHTML = `
                <div class="ell">
                    <div class="center picture">
                        <div class="red_point" style="transform: scale(0)"></div>
                    </div>
                </div>
                <div class="ell e">
                    <div class="center nickname" onclick="web.notice('off_work')">${this.nickname}</div>
                </div>
                <div class="ell e" onclick="web.notice('off_work')">
                    <div class="button center call"></div>
                </div>
                <div class="ell e" onclick="web.chooseFriend('${this.nickname}', '${this.id}', '${this.key}')">
                    <div class="button center chat"></div>
                </div>
                <div class="ell e" onclick="web.delete_friend('${this.id}')">
                    <div class="button center delete"></div>
                </div>`
        this.tab1.append(this.a)
        this.has_new_message && this.red_point.set()
    }
    show_application = () => {
        this.status == 'pending'? this.show_pending() : this.show_waiting()
        
        this.a.style.gridTemplateColumns = '0.5fr 10vw 2fr 4vw 4vw'
        this.tab2.append(this.a)
    }
    show_pending = () => {
        this.a.innerHTML = `
            <div class="ell">
                <div class="center picture"></div>
            </div>
            <div class="ell e" onclick="web.notice('off_work')">
                <div class="center nickname u">${this.id}</div>
            </div>
            <div class="ell e" onclick="web.notice('off_work')">
                <div class="center nickname u">${this.nickname}</div>
            </div>
            <div class="ell e" onclick="web.add_friend('${this.id}')">
                <div class="button center add_friend"></div>
            </div>
            <div class="ell e" onclick="web.delete_friend('${this.id}')">
                <div class="button center delete"></div>
            </div>`
    }
    show_waiting = () => {
        this.a.innerHTML = `
            <div class="ell">
                <div class="center picture"></div>
            </div>
            <div class="ell e" onclick="web.notice('off_work')">
                <div class="center nickname u">${this.id}</div>
            </div>
            <div class="ell e" onclick="web.notice('off_work')">
                <div class="center nickname u">${this.nickname}</div>
            </div>
            <div class="ell e" onclick="web.delete_friend('${this.id}')" style="grid-column: 4/6;">
                <div class="button center delete"></div>
            </div>`
    }
    red_point = {
        there_is : false,
        set   : () => {
            !this.red_point.there_is && !function(a, red_point) {
                a.children[0].children[0].children[0].style.transform = "scale(1)"
                red_point.there_is = true
            }(this.a, this.red_point)
        },
        delete: () => {
            this.red_point.there_is && !function(a, red_point) {
                a.children[0].children[0].children[0].style.transform = "scale(0)"
                red_point.there_is = false
            }(this.a, this.red_point)
        }
    }
    // type: HTML element
    tab1 = document.getElementsByClassName('content_for_f1')[0]
    tab2 = document.getElementsByClassName('content_for_f2')[0]
}

module.exports = Friend
