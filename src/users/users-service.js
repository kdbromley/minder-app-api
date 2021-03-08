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
        //
    },
}

module.exports = UsersService;