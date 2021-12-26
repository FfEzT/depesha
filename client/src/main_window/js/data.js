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

const fs = require('fs')

/**
 * this function manages data in the friend.json
 * @param {string} a delete_data||get_friends
 * @param {[]} b list of friends
 * @returns {[friend]}
 */
const main = (a, b=[]) => {
    let data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )

    switch (a) {
        case 'delete_data':
            data.friends = []
            break

        case 'get_friends':
            data.friends = b
            break
    }

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

const key_to_null = () => {
    fs.writeFile(
        './src/data/private.key',
        '{}',
        () => {}
    )
}

const message = {
    file: './src/data/message.json',
    message_to_null: () => {
        fs.writeFile(
            './src/data/message.json',
            '{}',
            () => {}
        )
    },
    /**
     * @param {str} id friend's id
     * @returns {[{messages}]}
     */
    get: id => {
        return JSON.parse(
            fs.readFileSync(message.file)
        )[id]
    },
    /**
     * write obj with message to file
     * @param {string} id friend's id
     * @param {{content, time, who_send}} obj
     */
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
