export {}

const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const friendshipScheme = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  friendshipStatus: { type: Boolean, default: false },
});

module.exports = model('friendship', friendshipScheme);