const crypto = require('crypto')
const cryptico = require('cryptico')

// hashing str
// in: str
// out: 
let hashing = str => {
    let a = crypto.scryptSync(str, str, 32).toString('hex')
    return crypto.scryptSync(a, a, 32).toString('hex')
}

let rsa = {
    createPrivate: pass_phrase => {
        return cryptico.generateRSAKey(pass_phrase, 2048)
    },
    createPublic: private_key => {
        return cryptico.publicKeyString(private_key)
    },
    encrypt: (str, public_key) => {
        return cryptico.encrypt(str, public_key).cipher
    },
    decrypt: str => {
        return cryptico.decrypt(str, user.key).plaintext
    }
}

let writing_key = str => {
    fs.writeFile(
        './src/data/.key',
        JSON.stringify(str),
        () => {}
    )
}

module.exports = {hashing, rsa, writing_key}