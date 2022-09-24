const jwt = require('jsonwebtoken');

exports.signAccessToken = async (payload, audience) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET_KEY;
        const options = {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
            issuer: process.env.JWT_ISSUER,
            audience: audience
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token)
        })
    })
} 

exports.verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    err.message = 'Your session has been expired';
                }
                reject({ message: err.message });
            }
            resolve(data)
        });
    })
}