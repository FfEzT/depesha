// import modules
const sql = require('sqlite3').verbose()

let people = () => {
    let db = new sql.Database('./data/people.sqlite')

    let sign_up = (id, nickname, password) => {
        return new Promise(
            (resolve, reject) => {
                db.run(
                    'INSERT INTO main values(?, ?, ?)',
                    [id, nickname, password],
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

    return {sign_up, get_user}
}
let temp_mail = () => {
    let db = new sql.Database('./data/temp_mail.sqlite')
}
let friends = () => {
    let db = new sql.Database('./data/friends.sqlite')

    let create_list = id => {
        let str = `CREATE TABLE ${id} (id TINYTEXT PRIMARY KEY, STATUS TINYTEXT)`
        db.run(str)
    }
    let get_friends = id => {
        return new Promise(
            resolve => {
                let str = `SELECT * FROM ${id} ORDER BY id` // todo ORDER BY nickname

                db.all(
                    str,
                    (er, data) => {
                        resolve(data)
                    }
                )
            }
        )
    }

    // write to db new friend or update their status
    // input: str, str, str(values: friend || not_friend || pending || waiting), f (incorrect data), e(ws)
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

    return {create_list, get_friends, write}
}

module.exports = {people, temp_mail, friends}
