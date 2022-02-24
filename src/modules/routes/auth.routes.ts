export {};

const express = require('express')
const router = express.Router()

const {
  login,
  registration,
} = require ('../controllers/controllers')

router.post('/registration', registration);
router.post('/login', login);

module.exports = router;