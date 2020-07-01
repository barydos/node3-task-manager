const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    setupDatabase, 
    userOne, 
    userTwo, 
    userOneId, 
    userTwoId, 
    taskOne, 
    taskTwo, 
    taskThree 
} = require('./fixtures/db')

beforeEach(async () => {
    await setupDatabase()
})

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "test task"
        })
        .expect(201)

    // Validate task in database
    const task = await Task.findById(response.body._id)
    expect(task).not.toBe(null)
    expect(task.completed).toEqual(false)
})

test('Should get two tasks from userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    // Validate two tasks retrieved
    expect(response.body.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
    
    // Assert task three remains in database
    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()
})

    