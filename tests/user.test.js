const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const newUser = {
    "name": "Test",
    "age": 25,
    "email": "test@gmail.com",
    "password": "testpass1"
} 

beforeEach(async () => {
    await User.deleteMany()
    await new User(newUser).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        "name": "Barry",
        "age": "24",
        "email": "barry@gmail.com",
        "password": "barrypass1"
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: newUser.email,
            password: newUser.password
        })
        .expect(200)
})

test('Should not login non-existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: "fakeEmail@gmail.com",
            password: "fakePassw0rd"
        })
        .expect(400)
})
