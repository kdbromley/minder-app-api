const path = require('path');
const express = require('express');
const RemindersService = require('./reminders-service');
const xss = require('xss');

const remindersRouter = express.Router();
const jsonParser = express.json();


const serializeReminder = reminder => ({
    id: reminder.id,
    title: xss(reminder.title),
    due_date: (reminder.due_date),
    reminder_notes: xss(reminder.reminder_notes),
    completed: reminder.completed,
    user_id: reminder.user_id
})

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
    .post(jsonParser, (req, res, next) => {
        const { title, due_date, reminder_notes, completed, user_id } = req.body;
        const newReminder = {  title, due_date, completed, user_id };

        for(const [key, value] of Object.entries(newReminder)) {
            if(value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        newReminder.reminder_notes = reminder_notes;
        
        RemindersService.insertReminder(
            req.app.get('db'),
            newReminder
        )
        .then(reminder => { 
            res
             .status(201)
             .location(path.posix.join(req.originalUrl, `/${reminder.id}`))
             .json(serializeReminder(reminder))
            })
        .catch(next)
    })

remindersRouter
    .route('/:reminderId')
    .all((req, res, next) => {
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
            res.reminder = reminder;
            next();
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res
         .status(200)
         .json(serializeReminder(res.reminder))
    })
    .delete((req, res, next) => {
        RemindersService.deleteReminder(
            req.app.get('db'),
            req.params.reminderId
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, due_date, reminder_notes, completed, user_id } = req.body;
        const updatedReminder = { title, due_date, completed }
    
        const numberOfValues = Object.values(updatedReminder).filter(Boolean).length;
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: { message: 'Body must contain one of: title, due_date, completed' }
            })
        }

        updatedReminder.reminder_notes = reminder_notes;
        
        RemindersService.updateReminder(
            req.app.get('db'),
            req.params.reminderId,
            updatedReminder
        )
        .then(reminder => {
            res
             .status(204)
             .end()
        })
    })


module.exports = remindersRouter;