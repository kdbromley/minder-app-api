const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');

describe('Reminders endpoints', () => {
    let db;

    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

    after('disconnect from db', () => db.destroy());
    before('clean table', () => db('reminders').truncate());
    afterEach('cleanup', () => db('reminders').truncate());

    describe('GET /reminders', () => {
        context('given no reminders', () => {
            it('responds with 200 and empty array', () => {
                return supertest(app)
                    .get('/api/reminders')
                    .expect(200)
            })
        })
    })

})