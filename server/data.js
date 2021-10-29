//import modules
const sql = require('sqlite3').verbose()

let db = new sql.Database('./data/main.sqlite')

let people = () => {
    let sign_up = (id, nickname, password, key) => {
        return new Promise(
            (resolve, reject) => {
                db.run(
                    'INSERT INTO main values (?, ?, ?, ?, "offline", 0, 0)',
                    [id, nickname, password, key],
                    err => {
                        err && reject()
                        resolve()
                    }
                )
            }
        )
    }
    let get_user = id => {
        return new Promise(
            resolve => {
                db.get(
                    'SELECT * FROM main WHERE id = ?',
                    [id],
                    (err, data) => {
                        resolve(data)
                    }
                )
            }
        )
    }

    //change status of client
    //input: str(id of client), str(online || offline || idle)
    let update_status = (who, status) => {
        let str = `UPDATE main SET status = '${status}' WHERE id = '${who}'`
        db.run(str)
    }

    //change status of client
    //input: str(id of client), int (0 || 1)
    let update_friends = (who, status) => {
        let str = `UPDATE main SET changes_friends = ${status} WHERE id = '${who}'`
        db.run(str)
    }

    // change status of new_message
    // in: str (id of people), int (0 = there isn't new message, and 1 = there is new message)
    let update_new_message = (who, status) => {
        let str = `UPDATE main SET new_message = '${status}' WHERE id = '${who}'`
        db.run(str)
    }

    return {
        sign_up,
        get_user,
        update_status,
        update_friends,
        update_new_message
    }
}
let temp_mail = {
    // in: str (id of people)
    get: id => {
        return new Promise(
            resolve => {
                const str = `SELECT who, time, content FROM temp_message WHERE id = '${id}'`
                db.all(
                    str,
                    (er, data) => {
                        db.run(
                            `DELETE FROM temp_message WHERE id = '${id}'`
                        )
                        resolve(data)
                    }
                )
            }
        )
    },
    // write data to db
    // in: str, str, str, str
    set: (id, who, time, content) => {
        const str = `INSERT INTO temp_message values ('${id}', '${who}', '${time}', '${content}')`
        db.run(str)
    }
}
let friends = () => {
    let create_list = id => {
        let str = `CREATE TABLE ${id} (id TINYTEXT PRIMARY KEY, status TINYTEXT)`
        db.run(str)
    }
    let get_friends = id => {
        return new Promise(
            resolve => {
                let str = `SELECT ${id}.id, main.nickname, ${id}.status, main.key
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
            }
        )
    }

    //write to db new friend or update their status
    //input: str, str, str(values: friend || not_friend || pending || waiting), f (incorrect data), e(ws)
    let write = (from, to, status) => {
        return new Promise(
            (resolve, reject) => {
                let str = `INSERT INTO ${from} VALUES (?, ?)`

                db.run(
                    str,
                    [to, status],
                    er => {
                        er && reject()
                        resolve()
                    }
                )
            }
        )
    }

    //update status of friends to 'friend'
    //input: str, str
    let add_friend = (whom, who) => {
        return new Promise(
            resolve => {
                let str_1 = `UPDATE ${whom} SET status = "friend" WHERE id = '${who}'`
                let str_2 = `UPDATE ${who} SET status = "friend" WHERE id = '${whom}'`

                db.run(str_1)
                db.run(str_2)

                resolve()
            }
        )
    }

    //delete people from list of friends
    //input: str, str
    let delete_friend = (whom, who) => {
        return new Promise(
            resolve => {
                let str_1 = `DELETE FROM ${whom} WHERE id = '${who}'`
                let str_2 = `DELETE FROM ${who} WHERE id = '${whom}'`

                db.run(str_1)
                db.run(str_2)
                
                resolve()
            }
        )
    }

    return {
        create_list,
        get_friends,
        write,
        add_friend,
        delete_friend
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
