const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');

const encrypt = (function () {
    function genRandomString(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    function sha512(password, salt) {
        const hash = crypto.createHmac('sha512', salt);

        hash.update(password);
        const value = hash.digest('hex');

        return {
            salt: salt,
            passwordHash: value
        };
    }

    function saltHashPassword(userpassword) {
        let salt = genRandomString(16);
        /** Gives us salt of length 16 */
        let passwordData = sha512(userpassword, salt);
        console.log('UserPassword = ' + userpassword);
        console.log('Passwordhash = ' + passwordData.passwordHash);
        console.log('nSalt = ' + passwordData.salt);
        return{
            hash: passwordData.passwordHash,
            salt: passwordData.salt
        }
    }
    //saltHashPassword('11111');
    //console.log(getHash('12345', "8f52ba9be66a9c53"));
    function getHash(pass, salt) {
        let hash = sha512(pass,salt).passwordHash;
        return hash;
    }

    return {
        getHash,
        sha512,
    };
}());

module.exports = encrypt;
