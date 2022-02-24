const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const userScheme = new Schema({
  login: {type: String, unique: true, required: true},
  password: {type: String, required: true}
});

module.exports = model('users', userScheme);