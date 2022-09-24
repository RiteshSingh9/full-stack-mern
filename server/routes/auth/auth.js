const router = require('express').Router();
const { validateRegister, validateLogin } = require('../../middlewares/authValidtionMiddleware');
const {
    register_user, login_user
} = require('../../controllers/authController');

router.post('/login', validateLogin, login_user)
router.post('/register', validateRegister, register_user)

module.exports = router;