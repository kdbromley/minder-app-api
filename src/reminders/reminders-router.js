const path = require('path');
const express = require('express');
const RemindersService = require('./reminders-service');
// npm i xss -- const xss = require('xss');

const remindersRouter = express.Router();
const jsonParser = express.json();

remindersRouter
    .route('/')
    .get((req, res, next) => {
        res.status(200).end()
    })


module.exports = remindersRouter;