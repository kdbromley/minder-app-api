const path = require('path');
const express = require('express');
const UsersService = require('./users-service');
// npm i xss -- const xss = require('xss');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')


module.exports = usersRouter