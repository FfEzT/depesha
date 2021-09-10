class Friend{
    constructor(id, nickname, status){
        this.id = id
        this.nickname = nickname
        this.status = status

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
        if(this.status == 'friend'){
            this.show_friend()
            return
        }
        if(this.status == 'pending' || 'waiting'){
            this.show_application()
            return
        }
    }
    show_friend = () => {
        this.a.innerHTML = `
                <div class="ell">
                    <div class="center picture"></div>
                </div>
                <div class="ell">
                    <div class="center nickname" onclick="web.notice('off_work')">${this.nickname}</div>
                </div>
                <div class="ell e" onclick="web.notice('off_work')">
                    <div class="button center call"></div>
                </div>
                <div class="ell e" onclick="web.notice('off_work')">
                    <div class="button center chat"></div>
                </div>
                <div class="ell e" onclick="web.delete_friend('${this.id}')">
                    <div class="button center delete"></div>
                </div>`
        this.tab1.append(this.a)
    }
    show_application = () => {
        this.status == 'pending'?
            this.show_pending()
            :
            this.show_waiting()

        this.tab2.append(this.a)
        return
    }
    show_pending = () => {
        this.a.style.gridTemplateColumns = '.5fr 1fr 2fr .25fr .25fr'
        this.a.innerHTML = `
            <div class="ell">
                <div class="center picture"></div>
            </div>
            <div class="ell e">
                <div class="center nickname u">${this.id}</div>
            </div>
            <div class="ell">
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
        this.a.style.gridTemplateColumns = '.5fr 1fr 1fr .5fr'
        this.a.innerHTML = `
            <div class="ell">
                <div class="center picture"></div>
            </div>
            <div class="ell">
                <div class="center nickname u">${this.id}</div>
            </div>
            <div class="ell">
                <div class="center nickname u">${this.nickname}</div>
            </div>
            <div class="ell e" onclick="web.delete_friend('${this.id}')">
                <div class="button center delete"></div>
            </div>`
    }
    // type: HTML element
    tab1 = document.getElementsByClassName('content_for_f1')[0]
    tab2 = document.getElementsByClassName('content_for_f2')[0]
}

module.exports = Friend