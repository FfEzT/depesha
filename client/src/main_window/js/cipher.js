/*
 * This file is part of Depesha.

 * Depesha is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Depesha is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with Depesha.  If not, see <https://www.gnu.org/licenses/>.
*/

const BYTE_LENGTH = 1024

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
        return cryptico.generateRSAKey(pass_phrase, BYTE_LENGTH)
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
