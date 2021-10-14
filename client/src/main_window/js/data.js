// this function manages data in the friend.json
// input: str ('delete_data' || 'get_friends'), array(list of friends)
// output: data.friends(array)
let main = (a, b=[]) => {
    //get data from friend.json
    //type: JSON
    let data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )
    
    //like switch(){}
    let bag = {
        'delete_data' : () => {
            data.friends = []
        },
        'get_friends': b => {
            data.friends = b
        }
    }
    bag[a] && bag[a](b)

    //write data to friend.json
    fs.writeFileSync(
        './src/data/friend.json',
        JSON.stringify(data)
    )
    return data.friends
}

// delete old info (key)
let key_to_null = () => {
    fs.writeFile(
        './src/data/private.key',
        '{}',
        () => {}
    )
}

let message = {
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
        let friend = message.get(id)

        let data = JSON.parse(
            fs.readFileSync(message.file)
        )

        if (!friend) {
            data[id] = []
        }

        data[id].push(obj)

        fs.writeFileSync(message.file, JSON.stringify(data))
    }
}

module.exports = {main, key_to_null, message}