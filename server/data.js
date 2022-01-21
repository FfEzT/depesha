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
    db: './data/main.sql',
    /**
     * @param {string} id
     * @param {string} nickname
     * @param {string} password
     * @param {string} key public key
     */
    sign_up: (id, nickname, password, key) => {
        return new Promise(
            (resolve, reject) => {
                // open database
                const db = new sql.Database(people.db)

                db.run(
                    'INSERT INTO main values (?, ?, ?, ?, "offline", 0, 0)',
                    [id, nickname, password, key],
                    err => {
                        err && reject()
                        resolve()
                    }
                )

                // closing database
                db.close()
            }
        )
    },
    /**
        @param {string} id
     */
    get_user: id => {
        return new Promise(
            resolve => {
                // open database
                const db = new sql.Database(people.db)

                db.get(
                    'SELECT * FROM main WHERE id = ?',
                    [id],
                    (err, data) => {
                        resolve(data)
                    }
                )

                // closing database
                db.close()
            }
        )
    },
    /**
     * change status of client
     * @param {string} who id
     * @param {string} status (online || offline || idle)
     */
    update_status: (who, status) => {
        // open database
        const db = new sql.Database(people.db)
        
        const str = `UPDATE main SET status = '${status}' WHERE id = '${who}'`
        db.run(str)

        // closing database
        db.close()
    },
    /**
     * change status of client
     * @param {string} who id
     * @param {number} status (0 || 1)
     */
    update_friends: (who, status) => {
        // open database
        const db = new sql.Database(people.db)

        const str = `UPDATE main SET changes_friends = ${status} WHERE id = '${who}'`
        db.run(str)

        // closing database
        db.close()
    },
    /**
     * change status of new_message
     * @param {string} who 
     * @param {number} status (0 = there isn't new message, and 1 = there is new message)
     */
    update_new_message: (who, status) => {
        // open database
        const db = new sql.Database(people.db)

        const str = `UPDATE main SET new_message = '${status}' WHERE id = '${who}'`
        db.run(str)

        // closing database
        db.close()
    }
}

const friends = {
    db: './data/main.sql',
    /**
     * creating table in database
     * @param {string} id
     */
    create_list: id => {
        // open database
        const db = new sql.Database(friends.db)

        const str = `CREATE TABLE ${id} (id TINYTEXT PRIMARY KEY, status TINYTEXT)`
        db.run(str)

        // closing database
        db.close()
    },
    /**
     * get list of friends from table
     * @param {string} id 
     * @returns {Promise<JSON>}
     */
    get_friends: id => {
        return new Promise(
            resolve => {
                // open database
                const db = new sql.Database(friends.db)

                const str = `SELECT ${id}.id, main.nickname, ${id}.status, main.key
                            FROM ${id}
                            JOIN main
                            ON ${id}.id = main.id
                            ORDER BY ${id}.status, main.nickname`
                db.all(
                    str,
                    (er, data) => {
                        resolve(data)
                    }
                )
                
                // closing database
                db.close()
            }
        )
    },
    /**
     * write to db new friend or update their status
     * @param {string} from id
     * @param {string} to id
     * @param {string} status (values: friend || not_friend || pending || waiting)
     * @returns {Promise<void>}
     */
    write: (from, to, status) => {
        return new Promise(
            (resolve, reject) => {
                // open database
                const db = new sql.Database(friends.db)

                const str = `INSERT INTO ${from} VALUES (?, ?)`
                db.run(
                    str,
                    [to, status],
                    er => {
                        er && reject()
                        resolve()
                    }
                )

                // closing database
                db.close()
            }
        )
    },
    /**
     * update status of new_friend
     * @param {string} whom id
     * @param {string} who id
     * @returns {Promise<void>}
     */
    add_friend: (whom, who) => {
        return new Promise(
            resolve => {
                // open database
                const db = new sql.Database(friends.db)

                const str_1 = `UPDATE ${whom} SET status = "friend" WHERE id = '${who}'`
                const str_2 = `UPDATE ${who} SET status = "friend" WHERE id = '${whom}'`

                db.serialize(
                    () => {
                        db.run(str_1)
                        db.run(
                            str_2,
                            () => {
                                resolve()
                            }
                        )
                    }
                )

                // closing database
                db.close()
            }
        )
    },
    /**
     * delete people from list of friends
     * @param {string} whom id
     * @param {string} who id
     * @returns {Promise<void>}
     */
    delete_friend: (whom, who) => {
        return new Promise(
            resolve => {
                // open database
                const db = new sql.Database(friends.db)

                const str_1 = `DELETE FROM ${whom} WHERE id = '${who}'`
                const str_2 = `DELETE FROM ${who} WHERE id = '${whom}'`

                db.serialize(
                    () => {
                        db.run(str_1)
                        db.run(
                            str_2,
                            () => {
                                resolve()
                            }
                        )
                    }
                )

                // closing database
                db.close()
            }
        )
    }
}

const temp_mail = {
    db: './data/temp_mail.sql',
    /**
     * get data from db
     * @param {string} id 
     * @returns {Promise<JSON>}
     */
    get: id => {
        return new Promise(
            resolve => {
                // open database
                const db = new sql.Database(temp_mail.db)

                const str = `SELECT who, time, content FROM temp_message WHERE id = '${id}'`
                db.all(
                    str,
                    (er, data) => {
                        resolve(data)
                    }
                )
                db.run(
                    `DELETE FROM temp_message WHERE id = '${id}'`
                )

                // closing database
                db.close()
            }
        )
    },
    /**
     * write data to db
     * @param {string} id 
     * @param {string} who id
     * @param {string} time 
     * @param {string} content message
     */
    set: (id, who, time, content) => {
        // open database
        const db = new sql.Database(temp_mail.db)

        const str = `INSERT INTO temp_message values ('${id}', '${who}', '${time}', '${content}')`
        db.run(str)

        // closing database
        db.close()
    }
}

// ! templates for database
// db.run(
//     'CREATE TABLE main (id TINYTEXT PRIMARY KEY, nickname TINYTEXT, password TINYTEXT, key TINYTEXT, status TINYTEXT, changes_friends TINYINT, new_message TYNYINT)'
// )
// db.run(
//     'CREATE TABLE temp_message (id TINYTEXT, who TINYTEXT, time TINYTEXT, content TEXT)'
// )

module.exports = {people, temp_mail, friends}
