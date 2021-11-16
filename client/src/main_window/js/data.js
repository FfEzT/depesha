const fs = require('fs')

// this function manages data in the friend.json
// input: str ('delete_data' || 'get_friends'), array(list of friends)
// output: data.friends(array)
const main = (a, b=[]) => {
    // get data from friend.json
    // type: JSON
    let data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )
    
    // like switch() {}
    const bag = {
        'delete_data' : () => {
            data.friends = []
        },
        'get_friends': b => {
            data.friends = b
        }
    }
    bag[a] && bag[a](b)

    // write data to friend.json
    fs.writeFileSync(
        './src/data/friend.json',
        JSON.stringify(data)  // todo before publishing remove last 2 arguments
    )
    return data.friends
}

const get_info = () => {
    return JSON.parse(
        fs.readFileSync('./src/data/user.json')
    )
}

const write_user_data = () => {
    fs.writeFileSync(
        './src/data/user.json',
        JSON.stringify(user.data)
    )
}

const get_key = () => {
    return fs.readFileSync('./src/data/private.key')
}

const write_key = key_to_write => {
    fs.writeFileSync(
        './src/data/private.key',
        JSON.stringify(
            key_to_write
        )
    )
}

const red_point = {
    open_file: () => {
        return JSON.parse(
            fs.readFileSync('./src/data/friend.json')
        )
    },
    write_file: data => {
        fs.writeFileSync(
            './src/data/friend.json',
            JSON.stringify(data)
        )
    },
    set: who => {
        const data = red_point.open_file()
        data.new_message[who] = true

        red_point.write_file(data)
    },
    delete: who => {
        const data = red_point.open_file()
        delete data.new_message[who]
        
        red_point.write_file(data)
    },
    to_null: () => {
        const data = red_point.open_file()
        data.new_message = {}
        
        red_point.write_file(data)
    }
}

// delete old info (key)
const key_to_null = () => {
    fs.writeFile(
        './src/data/private.key',
        '{}',
        () => {}
    )
}

const message = {
    file: './src/data/message.json',
    // delete old info (messages)
    message_to_null: () => {
        fs.writeFile(
            './src/data/message.json',
            '{}',
            () => {}
        )
    },
    // in: str(id of friend)
    // out: array(obj with message)
    get: id => {
        return JSON.parse(
            fs.readFileSync(message.file)
        )[id]
    },
    // write obj with message to file
    // in: str(id of friend), obj(content, time, who_send)
    write: (id, obj) => {
        const friend = message.get(id)

        let data = JSON.parse(
            fs.readFileSync(message.file)
        )

        if (!friend) {
            data[id] = []
        }

        data[id].push(obj)

        fs.writeFileSync(
            message.file,
            JSON.stringify(data)
        )
    }
}

module.exports = {
    main,
    key_to_null,
    message,
    red_point,
    get_info,
    write_user_data,
    get_key,
    write_key
}