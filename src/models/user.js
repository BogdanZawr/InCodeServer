const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
})

const User = mongoose.model('User', userSchema)


module.exports = User