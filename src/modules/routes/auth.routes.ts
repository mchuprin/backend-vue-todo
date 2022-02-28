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

router.post(
  '/registration',
  bodyValidator({
  login: ['required', (value) => {
    if (!/^[a-zA-Z0-9]*$/i.test(value)) {
      return 'Only latin symbols allowed';
    }
    }, {min: 2}],
  password: ['required', (value) => {
    if (!/^[a-zA-Z0-9]*$/i.test(value)) {
      return 'Only latin symbols allowed';
    }
    }, {min: 6}],
  }),
  registration);
router.post('/login', login);

module.exports = router;
