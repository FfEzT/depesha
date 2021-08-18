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

    return {create_list}
}

module.exports = {people, temp_mail, friends}
