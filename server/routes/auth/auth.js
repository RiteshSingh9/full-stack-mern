const router = require('express').Router();

router.post('/login', (req, res) => {
    res.json({
        message: 'Login  NOT IMPLEMENTED',
    })
})
router.post('/register', async (req, res, next) => {
    res.json({
        message: 'Register  NOT IMPLEMENTED',
    })
})

module.exports = router;