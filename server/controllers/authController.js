const createError = require('http-errors'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { validationResult } = require('express-validator');
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
            if (process.env.NODE_ENV === 'production') {
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
            return next(500)
        })

    }).catch((err) => {
        // duplicate entry for unique value
        if (err.code === 11000) {
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

exports.login_user = async (req, res, next) => {
    const errors = validationResult(req);
    // if there is an error in form data 
    if (!errors.isEmpty()) {
        return res.json({
            status: 'error',
            message: errors.array()
        })
    }
    // if there is no error
    const { email, password } = req.body;

    // try the find the user by their email
    await User.findOne({ email: email }, 'username email password').then(async (user) => {
        // check if user found or not
        if( !user ) {
            // if user not found
            return res.json({
                status: 'error',
                message: "Invalid Email or Password !"
            });
        }
        // is user found gthen check password
        bcrypt.compare(password, user.password).then(async (result) => {
            // if password dont't match
            if ( !result ) {
                return res.json({
                    status: 'error',
                    message: "Invalid Email or Password !"
                })
            }
            // if password matches
            const payload = {
                username: user.username,
                email: user.email,
            }
            const audience = toString(user._id);
            await signAccessToken(payload, audience).then((token) => {
                // in production mode
                if (process.env.NODE_ENV === 'production') {
                    return res.cookie('token', token, { httpOnly: true }).json({
                        status: 'ok',
                        data: {
                            username: user.username,
                            email: user.email
                        }
                    })
                }
                // while in development mode
                return res.json({
                    status: 'ok',
                    data: {
                        username: user.username,
                        email: user.email,
                        token: token
                    }
                })
            }).catch((err) => {
                return next(500)
            })
        }).catch((err) => {
            console.log('Error while comparing password : ',err);
            return next(createError(500))
        } )
        
    }).catch((err) => {
        console.log('Error while trying to find the user : ', err.message)
        next(createError(500))
    })
} 