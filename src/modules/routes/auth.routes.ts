export {};

const express = require('express')
const router = express.Router()

const {
  login,
  registration,
} = require ('../controllers/auth.controllers')

const authMiddleware = require('../../middlewares/authMiddleware');
const bodyValidator = require('../../middlewares/bodyValidator')

router.post(
  '/registration',
  bodyValidator({
  login: ['required', (value) => {
    if (!(/^[a-zA-Z0-9]*$/i.test(value))) {
      return 'Only latin symbols allowed';
    }
    }, {min: 4}],
  password: ['required', (value) => {
    if (!/^[a-zA-Z0-9]*$/i.test(value)) {
      return 'Only latin symbols allowed';
    }
    }, {min: 4}],
  }),
  registration);
router.post(
  '/login',
  bodyValidator({
    login: ['required', (value) => {
      if (!(/^[a-zA-Z0-9]*$/i.test(value))) {
        return 'Only latin symbols allowed';
      }
    }, {min: 4}],
    password: ['required', (value) => {
      if (!(/^[a-zA-Z0-9]*$/i.test(value))) {
        return 'Only latin symbols allowed';
      }
    }, {min: 4}],
  }),
  login);

module.exports = router;
