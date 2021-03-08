const { expect } = require('chai');
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
    });

    describe('GET /reminders/:reminderId', () => {
        context('given no reminders in db', () => {
            it('responds with 404', () => {
                const reminderId = 1234;
                return supertest(app)
                    .get(`/api/reminders/${reminderId}`)
                    .expect(404, { error: { message: `Reminder does not exist` } })
            })
        })
        
        context('given reminders in the db', () => {
            const testReminders = makeRemindersArray();
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

            it('returns 200 and specified article', () => {
                const reminderId = 2;
                return supertest(app)
                    .get(`/api/reminders/${reminderId}`)
                    .expect(200)
            })
        })
    })

    describe('POST /api/reminders', () => {
        const testUsers = makeUsersArray();
        beforeEach('create user', () => {
            return db
                .into('users')
                .insert(testUsers)
        })
        it('creates new reminder, returns 201 and new article', () => {
            const newReminder = {
                title: 'New reminder',
                due_date: '2021-03-10T10:00:00.000Z',
                reminder_notes: '',
                completed: false,
                user_id: 1
            }
            return supertest(app)
                .post('/api/reminders')
                .send(newReminder)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newReminder.title)
                    expect(res.body.due_date).to.eql(newReminder.due_date)
                    expect(res.body.reminder_notes).to.eql(newReminder.reminder_notes)
                    expect(res.body.completed).to.eql(newReminder.completed)
                    expect(res.body.user_id).to.eql(newReminder.user_id)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/reminders/${res.body.id}`)
                })
        })

        const requiredFields= ['title', 'due_date', 'completed', 'user_id']

        requiredFields.forEach(field => { 
            const newReminder = {
                title: 'Test new reminder',
                due_date: '2021-03-10T10:00:00.000Z',
                completed: true,
                user_id: 1,
            }

            it(`when ${field} missing, returns 400 and error`, () => {
                delete newReminder[field]

                return supertest(app)
                    .post('/api/reminders')
                    .send(newReminder)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe('DELETE /api/reminders/:reminderId', () => {
        context('given there are no reminders', () => {
            it('responds with 404 and error message', () => {
                const reminderId = 1234;
                return supertest(app)
                    .delete(`/api/reminders/${reminderId}`)
                    .expect(404, {
                        error: { message: `Reminder does not exist` }
                    })
            })
        })

        context('given there are reminders in db', () => {
            const testReminders = makeRemindersArray();
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

            it('responds with 204 and no content', () => {
                const reminderId = 2;
                return supertest(app)
                    .delete(`/api/reminders/${reminderId}`)
                    .expect(204)
            })
        })
    })

    describe('PATCH /api/reminders/:reminderId', () => {
        context('given no reminders', () => {
            it('responds with 404 and error message', () => {
                const reminderId = 1234;
                return supertest(app)
                    .patch(`/api/reminders/${reminderId}`)
                    .expect(404, {
                        error: { message: `Reminder does not exist`}
                    })
            })
        })

        context('given reminders in db', () => {
            const testReminders = makeRemindersArray();
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

            it('given all fields, responds with 204 and updates reminder', () => {
                const reminderId = 1;
                const updatedReminder = {
                    title: 'Updated title',
                    due_date: '2022-05-31T22:30:00.000Z',
                    reminder_notes: 'updated reminder notes',
                    completed: false,
                    user_id: 1
                }
                const expectedReminder = {
                    ...testReminders[reminderId - 1],
                    ...updatedReminder
                }

                return supertest(app)
                    .patch(`/api/reminders/${reminderId}`)
                    .send(updatedReminder)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                          .get(`/api/reminders/${reminderId}`)
                          .expect(expectedReminder)
                    ) 
            })
            it('given some fields, responds with 204 and updates reminder', () => {
                const reminderId = 1;
                const updatedReminder = {
                    title: 'Updated title',
                    completed: false,
                }
                const expectedReminder = {
                    ...testReminders[reminderId - 1],
                    ...updatedReminder
                }

                return supertest(app)
                    .patch(`/api/reminders/${reminderId}`)
                    .send({
                        ...updatedReminder,
                        falseField: `Should not be in Get response`
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/api/reminders/${reminderId}`)
                        .expect(expectedReminder)
                    )
            })
            it('given no required fields, responds with 400', () => {
                const reminderId = 1;

                return supertest(app)
                    .patch(`/api/reminders/${reminderId}`)
                    .send({ falseField: 'Foo' })
                    .expect(400, {
                        error: { message: 'Body must contain one of: title, due_date, completed' }
                    })
            })
        })
    })

})

describe.only('users endpoint', () => {
    let db;

    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

    after('disconnect from db', () => db.destroy());
    before('clean table', () => db.raw('TRUNCATE reminders, users RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE reminders, users RESTART IDENTITY CASCADE'));

    describe('GET /users', () => {
        context('no users in db', () => {
            it('returns 200 and empty array', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
                })
        })
        context('given users in db', () => {
            const testUsers = makeUsersArray();
            beforeEach('create user', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })
    
            it('returns 200 and all users', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsers)
            })
        })
    })

})