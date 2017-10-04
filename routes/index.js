const express = require('express');
const route = express.Router();
const api = require('./api');

route.get('/api', api)

module.exports = route;