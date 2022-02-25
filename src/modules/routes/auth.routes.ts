export {};

const express = require('express')
const router = express.Router()

const {
  login,
  registration,
  test
} = require ('../controllers/controllers')

const authMiddleware = require('../../middlewares/authMiddleware');
const bodyValidator = require('../../middlewares/bodyValidator')

router.post('/registration', registration);
router.post('/login', login);
router.post('/test', authMiddleware, bodyValidator({login: 'required', password: 'required'} ) , test);

module.exports = router;
