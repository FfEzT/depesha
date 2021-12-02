// import modules
const sql = require('sqlite3').verbose()

const people = {
    db: new sql.Database('./data/main.sqlite'),
    /**
     * @param {string} id 
     * @param {string} nickname 
     * @param {string} password 
     * @param {string} key public key
     */
    sign_up: (id, nickname, password, key) => {
        return new Promise(
            (resolve, reject) => {
                people.db.run(
                    'INSERT INTO main values (?, ?, ?, ?, "offline", 0, 0)',
                    [id, nickname, password, key],
                    err => {
                        err && reject()
                        resolve()
                    }
                )
            }
        )
    },
    /**
        @param {string} id
     */
    get_user: id => {
        return new Promise(
            resolve => {
                people.db.get(
                    'SELECT * FROM main WHERE id = ?',
                    [id],
                    (err, data) => {
                        resolve(data)
                    }
                )
            }
        )
    },
    /**
     * change status of client
     * @param {string} who id
     * @param {string} status (online || offline || idle)
     */
    update_status: (who, status) => {
        const str = `UPDATE main SET status = '${status}' WHERE id = '${who}'`
        people.db.run(str)
    },
    /**
     * change status of client
     * @param {string} who id
     * @param {number} status (0 || 1)
     */
    update_friends: (who, status) => {
        const str = `UPDATE main SET changes_friends = ${status} WHERE id = '${who}'`
        people.db.run(str)
    },
    /**
     * change status of new_message
     * @param {string} who 
     * @param {number} status (0 = there isn't new message, and 1 = there is new message)
     */
    update_new_message: (who, status) => {
        const str = `UPDATE main SET new_message = '${status}' WHERE id = '${who}'`
        people.db.run(str)
    }
}
const friends = {
    db: new sql.Database('./data/main.sqlite'),
    /**
     * creating table in database
     * @param {string} id
     */
    create_list: id => {
        const str = `CREATE TABLE ${id} (id TINYTEXT PRIMARY KEY, status TINYTEXT)`
        friends.db.run(str)
    },
    /**
     * get list of friends from table
     * @param {string} id 
     * @returns {Promise<JSON}
     */
    get_friends: id => {
        return new Promise(
            resolve => {
                const str = `SELECT ${id}.id, main.nickname, ${id}.status, main.key
                            FROM ${id}
                            JOIN main
                            ON ${id}.id = main.id
                            ORDER BY ${id}.status, main.nickname`
                friends.db.all(
                    str,
                    (er, data) => {
                        resolve(data)
                    }
                )
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
                const str = `INSERT INTO ${from} VALUES (?, ?)`
                friends.db.run(
                    str,
                    [to, status],
                    er => {
                        er && reject()
                        resolve()
                    }
                )
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
                const str_1 = `UPDATE ${whom} SET status = "friend" WHERE id = '${who}'`
                const str_2 = `UPDATE ${who} SET status = "friend" WHERE id = '${whom}'`

                friends.db.run(str_1)
                friends.db.run(str_2)

                resolve()
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
                const str_1 = `DELETE FROM ${whom} WHERE id = '${who}'`
                const str_2 = `DELETE FROM ${who} WHERE id = '${whom}'`
                friends.db.run(str_1)
                friends.db.run(str_2)
                
                resolve()
            }
        )
    }
}
const temp_mail = {
    db: new sql.Database('./data/temp_mail.sqlite'),
    /**
     * get data from db
     * @param {string} id 
     * @returns {Promise<JSON>}
     */
    get: id => {
        return new Promise(
            resolve => {
                const str = `SELECT who, time, content FROM temp_message WHERE id = '${id}'`
                temp_mail.db.all(
                    str,
                    (er, data) => {
                        temp_mail.db.run(
                            `DELETE FROM temp_message WHERE id = '${id}'`
                        )
                        resolve(data)
                    }
                )
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
        const str = `INSERT INTO temp_message values ('${id}', '${who}', '${time}', '${content}')`
        temp_mail.db.run(str)
    }
}

// todo delete
// db.run(
//    'DELETE FROM main'
// )
// db.run(
//     'CREATE TABLE main (id TINYTEXT PRIMARY KEY, nickname TINYTEXT, password TINYTEXT, key TINYTEXT, status TINYTEXT, changes_friends TINYINT, new_message TYNYINT)'
// )
// db.run(
//     'CREATE TABLE temp_message (id TINYTEXT, who TINYTEXT, time TINYTEXT, content TEXT)'
// )

module.exports = {people, temp_mail, friends}
