const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    character: Number,
})

const Client = mongoose.model('Client', clientSchema)


module.exports = Client