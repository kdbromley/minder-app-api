const path = require('path');
const express = require('express');
const UsersService = require('./users-service');
// npm i xss -- const xss = require('xss');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(
            req.app.get('db')
        )
        .then(user => res.json(user))
        .catch(next)
    })


module.exports = usersRouter