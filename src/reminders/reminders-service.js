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
    insertReminder(knex, newReminder) {
        return knex
            .insert(newReminder)
            .into('reminders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteReminder(knex, reminderId) {
        return knex('reminders')
            .where('id', reminderId)
            .delete()
    },
    udpateReminder(knex, reminderId, udpatedReminder) {
        return knex('reminders')
            .where('id', reminderId)
            .update(udpatedReminder)
    }
}

module.exports = RemindersService;