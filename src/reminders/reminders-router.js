const path = require('path');
const express = require('express');
const RemindersService = require('./reminders-service');
// npm i xss -- const xss = require('xss');

const remindersRouter = express.Router();
const jsonParser = express.json();

remindersRouter
    .route('/')
    .get((req, res, next) => {
        RemindersService.getAllReminders(
            req.app.get('db')
        )
        .then(reminders => {
            res.json(reminders)
        })
        .catch(next)
    })


module.exports = remindersRouter;