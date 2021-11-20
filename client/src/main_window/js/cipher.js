const crypto = require('crypto')
const cryptico = require('../js/cryptico')

/**
    Hashing str
    @param {string} str 
    @returns {string}
*/
const hashing = str => {
    const a = crypto.scryptSync(str, str, 32).toString('hex')
    return crypto.scryptSync(a, a, 32).toString('hex')
}

const rsa = {
    /**
        Create private key
        @param {string} pass_phrase
        @returns {cryptico.RSAKey}
    */
    create_private: pass_phrase => {
        return cryptico.generateRSAKey(pass_phrase, 1024)
    },

    /**
        Create public key
        @param {string} private_key
        @returns {string}
    */
    create_public: private_key => {
        return cryptico.publicKeyString(private_key)
    },

    /**
        Encrypting string
        @param {string} str
        @param {string} public_key
        @returns {string}
    */
    encrypt: (str, public_key) => {
        return cryptico.encrypt(str, public_key).cipher
    },

    /**
        Decrypting string
        @param {string} str
        @returns {string}
    */
    decrypt: str => {
        return cryptico.decrypt(str, user.key).plaintext
    },

    /**
        Import private key from file
        @returns {cryptico.RSAKey}
    */
    import_private: () => {
        return cryptico.RSAKey.parse(
            data.get_key()
        )
    }
}

module.exports = {hashing, rsa}