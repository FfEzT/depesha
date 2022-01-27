/**
 * generate future id for new users
 * @returns {string} length of string 3-7
 */
const generate_id = () => {
    const vowel = a => {
        const str = 'yuiiooaaeee'

        letter = a? 1 : 0

        const rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    const consonant = () => {
        const str = 'ttttnnnssshhrrddllccmmwwffggppbbvvkkxjqz'
    
        letter = 2
    
        const rand = Math.round(
            Math.random() * (str.length - 1)
        )
    
        return str[rand]
    }
    
    let letter, result = ''
    let value = Math.round(
        Math.random() * 4 + 3 // length of string 3-7 
    )
    
    for (let i = 0; i < value; ++i) {
        if (!letter || letter == 0) {
            const first_rand = Math.round(
                Math.random()
            )
    
            const bag = {
                0: () => {
                    result += vowel(true)
                },
                1: () => {
                    result += consonant()
                }
            }
    
            bag[first_rand] && bag[first_rand]()
        }
        else if (letter == 1) {
            result += consonant()
        }
        else if (letter == 2) {
            result += vowel()
        }
    }
    
    return result
}

module.exports = {
    generate_id
}