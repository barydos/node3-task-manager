const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


// // test middleware
// const jwt = require('jsonwebtoken')
// const testFunction = async () => {
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWQxYmU3ZTZjZjg0NjI5ZDBjNTBjZmYiLCJpYXQiOjE1OTA4MDQwOTZ9.dvR0aEew28Ir8WsubVXOcRbTKYMgH-ZtPXfD8-a8EwU'
//     const tokenValid = jwt.verify(token,'secretstring')
//     return tokenValid
// }

// testFunction()
//     .then((tokenValid) => console.log(tokenValid))
//     .catch(e => console.log(e.message))

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.send("Testing")
})

app.listen(port, () => {
    console.log("Listening on port " + port)
})