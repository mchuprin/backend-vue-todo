export {};
const router = require('express').Router();

const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes')
const usersRoutes = require('./user.routes')
const authMiddleware = require('../../middlewares/authMiddleware')

router.use('/task', authMiddleware, taskRoutes)
router.use('/auth', authRoutes);
router.use('/users', authMiddleware, usersRoutes)
module.exports = router;