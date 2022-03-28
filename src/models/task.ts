export {}

const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const taskScheme = new Schema({
  userId: {type: String, required: true},
  title: {type: String, required: true},
  isChecked: {type: Boolean, default: false},
  order: {type: Number, required: true},
});

module.exports = model('tasks', taskScheme);