const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeRemindersArray, makeUsersArray } = require('./reminders.fixtures');

describe('Reminders endpoints', () => {
    let db;

    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

    after('disconnect from db', () => db.destroy());
    before('clean table', () => db.raw('TRUNCATE reminders, users RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE reminders, users RESTART IDENTITY CASCADE'));

    describe('GET /reminders', () => {
        context('given no reminders', () => {
            it('responds with 200 and empty array', () => {
                return supertest(app)
                    .get('/api/reminders')
                    .expect(200, [])
            });
        });

        context('given reminders in table', () => {
            const testReminders = makeRemindersArray();
            console.log(testReminders)
            const testUsers = makeUsersArray();

            beforeEach('insert reminders into table', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('reminders')
                            .insert(testReminders)
                    })
            })

            it('responds with 200 and all reminders', () => {
                return supertest(app)
                    .get('/api/reminders')
                    .expect(200, testReminders)
            });
        });
    })

})