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

remindersRouter
    .route('/:reminderId')
    .get((req, res, next)=> {
        RemindersService.getReminderById(
            req.app.get('db'),
            req.params.reminderId
        )
        .then(reminder => {
            if(!reminder) {
                return res.status(404).json({
                    error: { message: `Reminder does not exist`}
                })
            }
            res.json(reminder)
        })
        .catch(next)
    })


module.exports = remindersRouter;