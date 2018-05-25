'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  general: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  job: {
    company: String,
    title: String
  },
  contact: {
    email: String,
    phone: String
  },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;