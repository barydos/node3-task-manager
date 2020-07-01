const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(async () => {
    await setupDatabase()
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        "name": "Barry",
        "age": "24",
        "email": "barryxwu@gmail.com",
        "password": "barrypass1"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert the response
    expect(response.body).toMatchObject({
        user: {
            name: "Barry",
            age: 24
        },
         token: user.tokens[0].token 
    })
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    // Validate new token is saved
    const user = await User.findById( userOneId )
    expect(user.tokens[1].token).toBe(response.body.token)
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

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    // Assert null response for user
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image',async () => {
    const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/test-profile-pic.jpg')
        .expect(200)
    
    // Check if image saved (as Buffer)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "NewName",
            age: 30
        })
        .expect(200)

    // Assert new values
    const user = await User.findById(userOneId)
    expect(user).toMatchObject({
        name: "NewName",
        age: 30
    })
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "test"
        })
        .expect(400)
})