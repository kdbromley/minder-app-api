const UsersService = {
    getAllUsers(knex) {
        return knex
            .select('*')
            .from('users')
    },
    getUserById(knex, userId) {
        return knex
            .select('*')
            .from('users')
            .where('id', userId)
            .first()
    },
    insertUser(knex, newUser) {
        return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
}

module.exports = UsersService;