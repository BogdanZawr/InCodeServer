'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dbMethods = require('../db/dbMethods');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = require('../../clients.json');
var cors = require('cors');
var app = (0, _express2.default)();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


app.use(cors());
app.use(_express2.default.json());

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/testmongoose');

var router = _express2.default.Router();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connect done');
});

var User = require('../models/user');
var Client = require('../models/client');
var admin = 2;
var user = 1;
var secretWord = 'kukumber';

router.use(expressJwt({ secret: secretWord }).unless({ path: ['/', /\/User\/.*/, /\/Search\/.*/, '/UserRegistration', '/UserLogIn'] }));

router.get("/", function (request, response) {
  (0, _dbMethods.getAllUsers)().then(function (user) {
    response.send(user);
  }).catch(function (err) {
    console.log(err);
  });
});

router.get("/User/:id", function (request, response) {
  (0, _dbMethods.getUser)(request.params.id).then(function (user) {
    response.send(user);
  }).catch(function (err) {
    console.log(err);
  });
});

router.get("/Search/:Search", function (request, response) {
  var regExp = new RegExp('(^|.*)' + request.params.Search + '.*', 'i');
  (0, _dbMethods.searchList)(regExp).then(function (user) {
    response.send(user);
  }).catch(function (err) {
    console.log(err);
  });
});

router.post("/Delete", function (request, response) {
  if (request.user.character === admin) {
    (0, _dbMethods.deleteUser)(request.body._id).then(function (user) {
      response.json("UserDeleted");
    }).catch(function (err) {
      console.log(err);
    });
  } else {
    response.json('Insufficient rights');
  }
});

router.post("/Edit/:id", function (request, response) {
  if (request.user.character) {
    (0, _dbMethods.editUser)(request.body._id, request.body).then(function (user) {
      response.json('User update');
    }).catch(function (err) {
      console.log(err);
    });
  } else {
    response.json('Insufficient rights');
  }
});

router.post("/UserRegistration", function (request, response) {
  var client = {
    email: request.body.email,
    password: request.body.password,
    character: user
  };
  jwt.sign(client, secretWord, function (err, token) {
    var client = new Client({
      email: request.body.email,
      token: token,
      character: user
    });
    client.save(function (err, client) {
      if (err) {
        console.log('err', err);
      }
      response.json({ token: token, email: request.body.email });
    });
  });
});

router.post("/UserLogIn", function (request, response) {
  (0, _dbMethods.clientLogIn)(request.body.email).then(function (client) {
    if (client.password == request.body.password) {
      response.json({ token: client.token, email: request.body.email });
    } else {
      response.json(null);
    }
  }).catch(function (err) {
    response.json(null);
  });
});

router.post("/AddUser", function (request, response) {
  if (request.user.character) {
    var _user = new User({
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
    });
    _user.save(function (err, user) {
      if (err) {
        console.log('err', err);
      }
    });
    response.json('User add');
  } else {
    response.json('Insufficient rights');
  }
});

function CreateUsersArray() {
  for (var i = 0; i < data.length; i++) {
    var element = data[i];
    var _user2 = new User({
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
    });

    _user2.save(function (err, user) {
      if (err) {
        console.log('err', err);
      }
      console.log('saved user', user);
    });
  }
}

exports.default = router;