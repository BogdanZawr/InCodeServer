'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.searchList = searchList;
exports.deleteUser = deleteUser;
exports.editUser = editUser;
exports.clientLogIn = clientLogIn;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _client = require('../models/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllUsers() {
    return _user2.default.find({});
}

function getUser(id) {
    return _user2.default.findById(id);
}

function searchList(regExp) {
    return _user2.default.find({
        $or: [{ 'general.firstName': regExp }, { 'general.lastName': regExp }]
    });
}

function deleteUser(id) {
    return _user2.default.findByIdAndDelete(id);
}

function editUser(id, body) {
    return _user2.default.findByIdAndUpdate(id, body);
}

function clientLogIn(email) {
    return _client2.default.findOne({ 'email': email });
}