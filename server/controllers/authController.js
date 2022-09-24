const { validationResult } = require('express-validator');
const User = require('../models/User.model');
const createError = require('http-errors');
const { signAccessToken } = require('../utilities/jwtHelper');

exports.register_user = async (req, res, next) => {
    const errors = validationResult(req);
    // if there is an error in form data 
    if (!errors.isEmpty()) {
        return res.json({
            status: 'error',
            message: errors.array()
        })
    }

    // if there is no error in form data
    const { username, email, password } = req.body;

    const user = new User({
        username,
        email,
        password
    })

    await user.save().then(async (data) => {
        // sign a jwt access token
        const payload = {
            username: data.username, 
            email: data.email
        }

        const audience = toString(data._id);
        await signAccessToken(payload, audience).then((token) => {
            if( process.env.NODE_ENV === 'production') {
                return res.cookie('token', token, { httpOnly: true }).json({
                    status: 'ok',
                    data: {
                        username: data.username,
                        email: data.email
                    }
                })
            }
            // while in development mode
            return res.json({
                status: 'ok',
                data: {
                    username: data.username,
                    email: data.email,
                    token: token
                }
            })
        }).catch((err) => {
            return next(500, err.message)
        })

    }).catch((err) => {
        // duplicate entry for unique value
        if(err.code === 11000) {
            return res.json({
                status: 'error',
                message: "Email already exists"
            })
        }

        return res.json({
            status: 'error',
            error: err.message
        })
    })

}