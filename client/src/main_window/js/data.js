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
 * manage data in the friend.json
 * @param {string} a delete_data || get_friends
 * @param {} b list of friends
 * @returns {[friend]}
 */
const friend = (a, b=[]) => {
    const data = JSON.parse(
        fs.readFileSync('./src/data/friend.json')
    )

    if (a) {
        switch (a) {
            case 'delete_data':
                data.friends = []
                break

            case 'set_friends':
                data.friends = b
                break
        }

        // write data to friend.json
        fs.writeFileSync(
            './src/data/friend.json',
            JSON.stringify(data, null, 4)
        )
    }

    return data.friends
}

const data_user = {
    get: () => {
        return JSON.parse(
            fs.readFileSync('./src/data/user.json')
        )
    },
    
    write: () => {
        fs.writeFileSync(
            './src/data/user.json',
            JSON.stringify(user.data, null, 4)
        )
    }
}

const key = {
    get: () => {
        return fs.readFileSync('./src/data/private.key')
    },

    write: key_to_write => {
        fs.writeFileSync(
            './src/data/private.key',
            JSON.stringify(
                key_to_write, null, 4
            )
        )
    },

    to_null: () => {
        fs.writeFile(
            './src/data/private.key',
            '{}',
            () => {}
        )
    }
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
            JSON.stringify(data, null, 4)
        )
    },
    /**
     * write info about new_message in file
     * @param {string} nickname nickname#1234
     */
    set: nickname => {
        const data = red_point.open_file()
        data.new_message[nickname] = true

        red_point.write_file(data)
    },
    /**
     * delete info about new_message in file
     * @param {string} nickname nickname#1234
     */
    delete: nickname => {
        const data = red_point.open_file()
        delete data.new_message[nickname]

        red_point.write_file(data)
    },
    /**
     * default (space) info about new_message in file
     */
    to_null: () => {
        let data = red_point.open_file()
        data.new_message = {}
        red_point.write_file(data)
    }
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
     * @param {str} id nickname#1234
     * @returns {[{messages}]}
     */
    get: id => {
        return JSON.parse(
            fs.readFileSync(message.file)
        )[id]
    },
    /**
     * write obj with message to file
     * @param {string} id nickname#1234
     * @param {{content, time, who_send}} obj
     */
    write: (id, obj) => {
        let data = JSON.parse( fs.readFileSync(message.file) )

        !message.get(id) && ( data[id] = [] )

        data[id].push(obj)

        fs.writeFileSync(
            message.file,
            JSON.stringify(data, null, 4)
        )
    }
}

module.exports = {
    friend,
    data_user,
    key,
    message,
    red_point
}
