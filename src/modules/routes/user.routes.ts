export {};

const express = require('express')
const router = express.Router()

const {
  getUsers,
  addFriend,
} = require ('../controllers/user.controllers')

router.get('', getUsers)
router.post('', addFriend)

module.exports = router;
