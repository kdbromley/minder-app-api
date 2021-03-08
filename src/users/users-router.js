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
    .post(jsonParser, (req, res, next) => {
        const { username, password, email, full_name } = req.body;
        const newUser = { username, password, email, full_name };
        
        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(user)
           })
       .catch(next)
    })


module.exports = usersRouter