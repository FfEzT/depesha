/**
 * generate future id for new users
 * @returns {string}
 */
const generate_id = async nickname => {
    const get_last_user = require('./data.js').people.get_last_user

    const id = await get_last_user(nickname)

    return id? ++id.id : 1
}

module.exports = {generate_id}
