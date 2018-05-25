'use strict';

var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    character: Number
});

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;