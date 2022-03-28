export {}

const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const userScheme = new Schema({
  login: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  avatar: {type: String, default: null},
  biography: {type: String, default: `User didnt tell about yourself`},
});

module.exports = model('users', userScheme);