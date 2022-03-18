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

// import modules
const sql = require('sqlite3').verbose()

const people = {
    /**
     * @param {function} callback
     */
    db: callback => {
        // open database
        const db = new sql.Database('./data/main.sql')

        callback(db)

        // closing database
        db.close()
    },
    /**
     * @param {string} nickname
     * @param {number} id
     * @param {string} password
     * @param {string} key public key
     * @returns {Promise<void>}
     */
    sign_up: (nickname, id, password, key) => {
        return new Promise(
            (resolve, reject) => {
                people.db(
                    db => {
                        db.run(
                            'INSERT INTO main values (?, ?, ?, ?, "offline", 0, 0)',
                            [nickname, id, password, key],
                            err => {
                                err && reject()
                                resolve()
                            }
                        )
                    }
                )
            }
        )
    },
    /**
        @param {string} nickname
        @param {number} id
        @returns {object} list of people
     */
    get_user: (nickname, id) => {
        return new Promise(
            resolve => {
                people.db(
                    db => {
                        const str = `SELECT * FROM main WHERE nickname = '${nickname}' AND id = ${id}`
                        db.get(
                            str,
                            (err, data) => resolve(data)
                        )
                    }
                )
            }
        )
    },
    /**
     * @param {string} nickname
     * @returns {Promise<object>}
     */
    get_last_user: nickname => {
        return new Promise(
            resolve => {
                people.db(
                    db => {
                        db.get(
                            'SELECT id FROM main WHERE nickname = ? ORDER BY id DESC',
                            [nickname],
                            (err, data) => resolve(data)
                        )
                    }
                )
            }
        )
    },
    /**
     * change status of client
     * @param {string} nickname
     * @param {number} id
     * @param {string} status (online || offline || idle)
     */
    update_status: (nickname, id, status) => {
        people.db(
            db => {
                const str = `UPDATE main SET status = '${status}' WHERE nickname = '${nickname}' AND id = ${id}`
                db.run(str)
            }
        )
    },
    /**
     * change status of client
     * @param {string} nickname
     * @param {string} id
     * @param {number} status (0 = there isn't new friends, and 1 = there is new message)
     */
    update_friends: (nickname, id, status) => {
        people.db(
            db => {
                const str = `UPDATE main SET changes_friends = ${status} WHERE nickname = '${nickname}' AND id = ${id}`
                db.run(str)
            }
        )
    },
    /**
     * change status of new_message
     * @param {string} nickname
     * @param {number} id
     * @param {number} status (0 = there isn't new message, and 1 = there is new message)
     */
    update_new_message: (nickname, id, status) => {
        people.db(
            db => {
                const str = `UPDATE main SET new_message = ${status} WHERE nickname = '${nickname}' AND id = ${id}`
                db.run(str)
            }
        )
    }
}

const friends = {
    /**
     * @param {function} callback
     */
    db: callback => {
        // open database
        const db = new sql.Database('./data/main.sql')

        callback(db)

        // closing database
        db.close()
    },
    /**
     * creating table in database
     * @param {string} id nickname#1234
     */
    create_list: id => {
        friends.db(
            db => {
                const str = `CREATE TABLE '${id}' (nickname TINYTEXT, id TINYINT, status TINYTEXT)`
                db.run(str)
            }
        )
    },
    /**
     * write to db new friend or update their status
     * @param {string} table nickname#1234
     * @param {string} nickname
     * @param {number} id
     * @param {string} status (values: friend || pending || waiting)
     * @returns {Promise<void>}
     */
    write: (table, nickname, id, status) => {
        return new Promise(
            (resolve, reject) => {
                friends.db(
                    db => {
                        const str = `INSERT INTO '${table}' VALUES ('${nickname}', ${id}, '${status}')`
                        db.run(
                            str,
                            er => {
                                er && reject()
                                resolve()
                            }
                        )
                    }
                )
            }
        )
    },
    /**
     * update status of new_friend
     * @param {string} table nickname#1234
     * @param {string} nickname
     * @param {number} id
     * @returns {Promise<void>}
     */
    add_friend: (table, nickname, id) => {
        return new Promise(
            resolve => {
                friends.db(
                    db => {
                        const str = `UPDATE '${table}' SET status = "friend" WHERE nickname = '${nickname}' AND id = ${id}`

                        db.run(
                            str,
                            () => resolve()
                        )
                    }
                )
            }
        )
    },
    /**
     * delete people from list of friends
     * @param {string} table id nickname#1234
     * @param {string} nickname
     * @param {number} id
     * @returns {Promise<void>}
     */
    delete_friend: (table, nickname, id) => {
        return new Promise(
            resolve => {
                friends.db(
                    db => {
                        const str = `DELETE FROM '${table}' WHERE nickname = '${nickname}' AND id = ${id}`

                        db.run(
                            str,
                            () => resolve()
                        )
                    }
                )
            }
        )
    },
    /**
     * get list of friends from table
     * @param {string} id title of table (nickname#1234)
     * @returns {Promise<JSON>}
     */
    get_friends: id => {
        return new Promise(
            resolve => {
                friends.db(
                    db => {
                        const str = `SELECT '${id}'.id, '${id}'.nickname, '${id}'.status, main.key
                            FROM '${id}'
                            JOIN main
                            ON '${id}'.nickname = main.nickname AND '${id}'.id = main.id
                            ORDER BY '${id}'.status, main.nickname`
                        db.all(
                            str,
                            (er, data) => resolve(data)
                        )
                    }
                )
            }
        )
    }
}

const temp_mail = {
    db: callback => {
        // open database
        const db = new sql.Database('./data/temp_mail.sql')

        callback(db)

        // closing database
        db.close()
    },
    /**
     * get and delete data from db
     * @param {string} recipient nickname#1234
     * @returns {Promise<JSON>}
     */
    get: recipient => {
        return new Promise(
            resolve => {
                temp_mail.db(
                    db => {
                        const str = `SELECT sender, time, content FROM temp_message WHERE recipient = '${recipient}'`
                        db.all(
                            str,
                            (er, data) => resolve(data)
                        )
                        db.run(
                            `DELETE FROM temp_message WHERE recipient = '${recipient}'`
                        )
                    }
                )
            }
        )
    },
    /**
     * write data to db
     * @param {string} recipient id nickname#1234
     * @param {string} sender id nickname#1234
     * @param {string} time
     * @param {string} content message
     */
    set: (recipient, sender, time, content) => {
        temp_mail.db(
            db => {
                const str = `INSERT INTO temp_message values ('${recipient}', '${sender}', '${time}', '${content}')`
                db.run(str)
            }
        )
    }
}

// ! templates for database
// const db = new sql.Database('./data/main.sql')
// db.run(
//         'CREATE TABLE main (nickname TINYTEXT, id TINYINT, password TINYTEXT, key TINYTEXT, status TINYTEXT, changes_friends TINYINT, new_message TINYINT)'
//     )
// const db = new sql.Database('./data/temp_mail.sql')
// db.run(
//     'CREATE TABLE temp_message (recipient TINYTEXT, sender TINYTEXT, time TINYTEXT, content TEXT)'
// )

module.exports = {people, temp_mail, friends}
