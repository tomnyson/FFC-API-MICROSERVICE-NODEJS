const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    log: [{
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: new Date().toUTCString()
      }
    }]
  });
  const User = mongoose.model('User', userSchema);
  module.exports = User
  