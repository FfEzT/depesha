/**
 * @param {string} string
 * @returns {{nickname, id}}
 */
 const parse = string => {
    return {
        nickname: string.slice(0, string.match('#').index ),
        id: string.slice( ++string.match('#').index )
    }
}

module.exports = {parse}