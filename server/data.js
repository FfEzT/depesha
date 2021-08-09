// @ts-check
// import modules
const sql = require('sqlite3').verbose()

let people = () => {
    let db = new sql.Database('./data/people.sqlite')

    let sign_up = (id, nickname, password) => {
        return new Promise(
            (resolve, reject) => {
                db.run(
                    'INSERT INTO main values(?, ?, ?, "offline")',
                    [id, nickname, password],
                    err => {
                        err && reject()
                        resolve()
                    }
                )
            }
        )
    }
    let update_status = (id, status) => {
        db.run(
            'UPDATE main SET status = ? WHERE id = ?',
            [status, id]
        )
    }
    let get_user =  id => {
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

    return {sign_up, update_status, get_user}
}
let temp_mail = () => {
    let db = new sql.Database('./data/temp_mail.sqlite')
}
let friends = () => {
    let db = new sql.Database('./data/friends.sqlite')
}

module.exports = {people, temp_mail, friends}
