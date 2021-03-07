const RemindersService = {
    getAllReminders(knex) {
        return knex
            .select('*')
            .from('reminders')
    },
    getReminderById(knex, reminderId) {
        return knex
            .select('*')
            .from('reminders')
            .where('id', reminderId)
            .first()
    },
    insertReminder(knex) {
        //add new reminder to table and return
    },
    deleteReminder(knex) {
        //remove reminder with specified id
    },
    udpateReminder(knex) {
        //edit and update reminder with specified id
    }
}

module.exports = RemindersService;