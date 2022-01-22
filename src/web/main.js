let ws = new WebSocket('wss://webrtcffezt.herokuapp.com/')

const iceServers = [
    {
        username: undefined,
        credential: undefined,
        url: 'stun:stun.voiparound.com',
        urls: [ 'stun:stun.voiparound.com' ]
    },
    {
        username: undefined,
        credential: undefined,
        url: 'stun:stun.ideasip.com',
        urls: [ 'stun:stun.ideasip.com' ]
    },
    {
        url: 'turn:relay.backups.cz?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    }
]

const element = {
    body: document.getElementsByTagName('body')[0],
    status: document.getElementById('status'),
    list: document.getElementById('list'),
    localVideo: document.getElementById('local'),
    remoteVideo: document.getElementById('remote'),
    id: document.getElementById('id')
}

const user = {
    name: '',
    call_to: undefined,
    stream: undefined,
    peer: new RTCPeerConnection( {iceServers} )
}

let channel

const init = async () => {
    user.stream = await navigator.mediaDevices.getUserMedia(
        {
            video: true,
            audio: {
                sampleRate: 48000,
                sampleSize: 16,
                channelCount: 1,
                noiseSuppression: false,
                echoCancellation: false,
                autoGainControl: false
            }
        }
    )

    channel = await user.peer.createDataChannel('main')
    channel.onopen = () => {send('calling', user.name); console.warn('Сервер: "ну сообщения выводятся"')}
    channel.onmessage = e => console.log(e.data)

    user.peer.ondatachannel = event => {
        channel = event.channel
    }

    user.peer.onicecandidate = e => {
        e.candidate && send(
           'ice',
            {
                from: user.name,
                data: e.candidate,
                to: user.call_to
            }
        )
    }

    element.localVideo.srcObject = user.stream
    user.peer.ontrack = e => {
        delete_list()
        element.remoteVideo.srcObject = e.streams[0]
    }
    for (const track of user.stream.getTracks() ) {
        user.peer.addTrack(track, user.stream)
    }
}
init()

const change_status = str => {
    element.status.innerText = str
    switch (str) {
        case 'online':
            element.status.classList.replace('offline', 'online')
            break

        case 'offline':
            element.status.classList.replace('online', 'offline')
            break
    }
}

const send = (type, data) => {
    ws.send(
        JSON.stringify(
            {type, data}
        )
    )
}

const delete_list = () => {
    element.list.innerHTML = ''
}

const auth = id => {
    element.id.classList.remove('hide')
    element.id.innerHTML = `Вы пользователь -> <span class="online">${id}</span>`
    user.name = id
}

const create_list = list => {
    delete_list()

    for (const id of list) {
        if (id != user.name) {
            const el = document.createElement('div')
            el.innerHTML = `
                ${id} -> <button onclick='call("${id}")'>Позвонить</button>
            `

            element.list.append(el)
        }
    }
}

const call = async id => {
    user.call_to = id

    const offer = await user.peer.createOffer()
    await user.peer.setLocalDescription(offer)
    send(
        'offer',
        {
            from: user.name,
            to: user.call_to,
            offer
        }
    )
}

const offer = async data => {
    await user.peer.setRemoteDescription(data)
    const answer = await user.peer.createAnswer()

    await user.peer.setLocalDescription(answer)

    send(
        'answer',
        {
            to: user.call_to,
            answer
        }
    )
}

const answer = async data => {
    await user.peer.setRemoteDescription(data)
}

ws.onopen = () => {
    change_status('online')
    send('auth')
}
ws.onmessage = e => {
    const a = JSON.parse(e.data)

    switch (a.type) {
        case 'auth':
            auth(a.data)
            break

        case 'list':
            !user.call_to && create_list(a.data)
            break

        case 'new_ice':
            user.call_to = a.data.from
            user.peer.addIceCandidate(a.data.data)
            break

        case 'new_offer':
            user.call_to = a.data.from
            offer(a.data.offer)
            break

        case 'new_answer':
            answer(a.data)
            break
    }
}
ws.onclose = () => change_status('offline')