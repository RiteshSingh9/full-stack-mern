const router = require('express').Router();
const { validateRegister } = require('../../middlewares/authValidtionMiddleware');
const {
    register_user
} = require('../../controllers/authController');

router.post('/login', (req, res) => {
    res.json({
        message: 'Login  NOT IMPLEMENTED',
    })
})
router.post('/register', validateRegister, register_user)

module.exports = router;