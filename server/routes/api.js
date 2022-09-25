const router = require('express').Router();

const authRouter = require('./auth/auth');
const todoRouter = require('./todo/todoRouter');

router.use('/auth', authRouter)

/** /api/todo/ */
router.use('/todo', todoRouter)

module.exports = router;