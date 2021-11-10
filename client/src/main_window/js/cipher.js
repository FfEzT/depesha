const crypto = require('crypto')
const cryptico = require('../js/cryptico')

// hashing str
// in: str
// out: str
let hashing = str => {
    let a = crypto.scryptSync(str, str, 32).toString('hex')
    return crypto.scryptSync(a, a, 32).toString('hex')
}

let rsa = {
    create_private: pass_phrase => {
        return cryptico.generateRSAKey(pass_phrase, 1024)
    },
    create_public: private_key => {
        return cryptico.publicKeyString(private_key)
    },
    encrypt: (str, public_key) => {
        return cryptico.encrypt(str, public_key).cipher
    },
    decrypt: str => {
        return cryptico.decrypt(str, user.key).plaintext
    },
    import_private: obj => {
        return cryptico.RSAKey.parse(obj)
    }
}

module.exports = {hashing, rsa}