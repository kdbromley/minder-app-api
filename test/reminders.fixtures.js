function makeRemindersArray() {
    return [
        {
            id: 1,
            title: 'Reminder 1',
            due_date: '2021-03-06T18:30:00.000Z',
            reminder_notes: 'reminder 1',
            completed: true,
            user_id: 1
        },
        {
            id: 2,
            title: 'Reminder 2',
            due_date: '2021-03-10T10:00:00.000Z',
            reminder_notes: '',
            completed: false,
            user_id: 1
        },
        {
            id: 3,
            title: 'Reminder 3',
            due_date: '2021-05-06T05:00:00.000Z',
            reminder_notes: 'reminder 3',
            completed: false,
            user_id: 1
        },
        {
            id: 4,
            title: 'Reminder 4',
            due_date: '2020-03-06T00:00:00.000Z',
            reminder_notes: '',
            completed: true,
            user_id: 1
        },
    ]
}

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'testuser',
            password: 'testpass',
            email: 'testemail@host.com',
            full_name: 'Test Name'
        },
    ]
}


module.exports = {
    makeRemindersArray,
    makeUsersArray
}