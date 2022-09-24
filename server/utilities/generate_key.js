const crypto = require('crypto');

const generateKeys = (strength, to = 'hex') => {
    return crypto.randomBytes(strength).toString(to);
}

try {
    if (parseInt(process.argv[2]) && process.argv[3]) {
        const key = generateKeys(parseInt(process.argv[2]), process.argv[3])
        console.log(key)
    } else {
        console.log(' Please specify the strength encoding for key')
    }
} catch (e) {
    console.log(e.message)
}