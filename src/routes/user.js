const data = require('../../clients.json')
var cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
import express from 'express';
import { getAllUsers, getUser, searchList, deleteUser, editUser, clientLogIn } from '../db/dbMethods';

app.use(cors());
app.use(express.json());

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/testmongoose');

const router = express.Router();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connect done')
});

const User = require('../models/user')
const Client = require('../models/client')
const admin = 2;
const user = 1;
const secretWord = 'kukumber';

router.use(expressJwt({ secret: secretWord }).unless({ path: ['/', /\/User\/.*/, /\/Search\/.*/, '/UserRegistration', '/UserLogIn'] }));

router.get("/", (request, response) => {
    getAllUsers()
    .then(user => {    
        response.send(user);
    })
    .catch(err =>{
        console.log(err)
    })
});

router.get("/User/:id", (request, response) => {
    getUser(request.params.id)
    .then(user => {response.send(user)})
    .catch(err =>{console.log(err)})
})

router.get("/Search/:Search", (request, response) => {
    let regExp = new RegExp('(^|.*)' + request.params.Search + '.*', 'i')
    searchList(regExp)
    .then(user => {response.send(user)})
    .catch(err =>{console.log(err)})
})

router.post("/Delete", function (request, response) {
  if (request.user.character === admin) {
    deleteUser(request.body._id)
    .then(user => {response.json("UserDeleted")})
    .catch(err =>{console.log(err)})
} else {
    response.json('Insufficient rights')
  }
})

router.post("/Edit/:id", function (request, response) {
  if (request.user.character) {
    editUser(request.body._id, request.body)
    .then(user => {response.json('User update')})
    .catch(err =>{console.log(err)})
  } else {
    response.json('Insufficient rights')
  }
})

router.post("/UserRegistration", function (request, response) {
  const client = {
    email: request.body.email,
    password: request.body.password,
    character: user,
  };
  jwt.sign(client, secretWord, function (err, token) {
    const client = new Client({
      email: request.body.email,
      token: token,
      character: user,
    })
    client.save((err, client) => {
      if (err) {
        console.log('err', err)
      }
      response.json({token, email: request.body.email});
    })
  });
})

router.post("/UserLogIn", function (request, response) {
    clientLogIn(request.body.email)
    .then(client => {
        if (client.password == request.body.password) {
            response.json({token: client.token, email: request.body.email});
          } else { response.json(null) }
    })
    .catch(err => {response.json(null)})
})

router.post("/AddUser", function (request, response) {
  if (request.user.character) {
    const user = new User({
      general: {
        firstName: request.body.general.firstName,
        lastName: request.body.general.lastName,
        avatar: request.body.general.avatar
      },
      job: {
        company: request.body.job.company,
        title: request.body.job.title
      },
      contact: {
        email: request.body.contact.email,
        phone: request.body.contact.phone
      },
      address: {
        street: request.body.address.street,
        city: request.body.address.city,
        zipCode: request.body.address.zipCode,
        country: request.body.address.country
      }
    })
    user.save((err, user) => {
      if (err) {
        console.log('err', err)
      }
    })
    response.json('User add');
  } else {
    response.json('Insufficient rights')
  }
})

function CreateUsersArray() {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const user = new User({
      general: {
        firstName: element.general.firstName,
        lastName: element.general.lastName,
        avatar: element.general.avatar
      },
      job: {
        company: element.job.company,
        title: element.job.title
      },
      contact: {
        email: element.contact.email,
        phone: element.contact.phone
      },
      address: {
        street: element.address.street,
        city: element.address.city,
        zipCode: element.address.zipCode,
        country: element.address.country
      }
    })

    user.save((err, user) => {
      if (err) {
        console.log('err', err)
      }
      console.log('saved user', user)
    })
  }
}

export default router;
