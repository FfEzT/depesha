/**
 * @param {string} string
 * @returns {{nickname, id}}
 */
const parser = string => {
    return {
        nickname: string.slice(0, string.match('#').index ),
        id: string.slice( ++string.match('#').index )
    }
}

module.exports = {parser}