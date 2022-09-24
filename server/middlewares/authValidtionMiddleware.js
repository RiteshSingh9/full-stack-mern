const { body } = require('express-validator');

exports.validateRegister = [
    body('username').not().isEmpty().withMessage("Username is reuired!").bail(),

    body('email').not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Invalid Email !').bail(),

    body('password').not().isEmpty().withMessage('Password is required').bail().isStrongPassword().withMessage('Password must be contain  characters and must be 8 characters long').bail(),

    body('confirm_password').not().isEmpty().withMessage('Confirm Password is required').bail().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password don't match");
        }
        return true;
    }).bail(),
]

exports.validateLogin = [
    body('email').not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Invalid Email !').bail(),

    body('password').not().isEmpty().withMessage('Password is required').bail()
]