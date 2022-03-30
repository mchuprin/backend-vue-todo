import { Request, Response } from 'express';
const {ObjectId} = require('mongodb');
const userModel = require('../../models/user.ts')
const taskModel = require('../../models/task.ts')
const friendModel = require('../../models/friendship.ts')

module.exports.addFriend = async(req, res) => {
  const _id = req.user.id
  const { friendId } = req.body
  console.log(_id, friendId)
  try {
    const checkFriendship = await friendModel.find({senderId: _id, receiverId: friendId})
    if (!!checkFriendship.length) {
      console.log(checkFriendship)
      return res.status(200).send({ msg: 'Request already exists'})
    }
    const friendRequest = await friendModel.create({
      senderId: _id,
      receiverId: friendId,
    })
    return res.status(200).send({ msg: 'Friend request has been sent' })
  } catch (e) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

module.exports.getFriendRequests = async (req, res) => {
  const _id = req.user.id
  try {
    const requestsDB = await friendModel.find({ receiverId: _id, friendshipStatus: false }).lean()
    const requests = await Promise.all(requestsDB.map( async request => {
      const sendingUser = await userModel.findOne({ _id: ObjectId(request.senderId) });
      return {
        ...request,
        login: sendingUser.login,
        avatar: sendingUser.avatar,
      }
    }))
    return res.status(200).send(requests)
  } catch (err) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

module.exports.acceptFriendship = async (req, res) => {
  const { requestId } = req.body
  console.log(requestId)
  try {
    await friendModel.updateOne({ _id: ObjectId(requestId) }, {
      $set: {
        friendshipStatus: true,
      }
    })
    return res.status(200).send('User has been added to your friends')
  } catch (err) {
    return res.status(500).send({ msg: 'Internal server error' })
  }
}

