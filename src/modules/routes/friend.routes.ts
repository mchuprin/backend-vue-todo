export {};

const express = require('express')
const router = express.Router()

const {
  addFriend,
  getFriendRequests,
  acceptFriendship,
} = require ('../controllers/friend.controllers')

router.post('', addFriend)
router.get('/requests', getFriendRequests)
router.patch('/acceptFriendship', acceptFriendship)

module.exports = router;
