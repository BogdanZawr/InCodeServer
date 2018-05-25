import mongoose from 'mongoose';
import User from '../models/user';
import Client from '../models/client';


export function getAllUsers() {
  return User.find({});
}

export function getUser(id) {
    return User.findById(id)
}

export function searchList(regExp) {
    return User.find({
        $or: [
            { 'general.firstName': regExp },
            { 'general.lastName': regExp }
        ]
      })
}

export function deleteUser(id) {
    return User.findByIdAndDelete(id)
}

export function editUser(id, body) {
    return User.findByIdAndUpdate(id, body)
}

export function clientLogIn(email) {
    return Client.findOne({ 'email': email })
}