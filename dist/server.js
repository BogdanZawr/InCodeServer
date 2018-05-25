'use strict';

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serverPort = 8000;
var app = (0, _express2.default)();
var cors = require('cors');

app.use(cors());
app.use(_express2.default.json());

app.use('', _user2.default);

app.listen(serverPort);