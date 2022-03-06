
/**
 * generate future id for new users
 * @returns {string}
 */
const generate_id = async nickname => {
    const get_last_user = require('./data.js').people.get_last_user

    const id = await get_last_user(nickname)

    if (id) return ++id.id
    else return 1
}

/**
 * @param {string} string
 * @returns {{nickname, id}}
 */
const name_parse = string => {
    return {
        // TODO from _ to :
        nickname: string.slice(0, string.match('_').index ),
        // TODO from _ to :
        id: string.slice( ++string.match('_').index )
    }
}

module.exports = {generate_id, name_parse}
