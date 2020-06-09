const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'secretstring')
        const user = await User.findOne( { _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token
    } catch (e) {
        res.status(401).send({"error": "Please authenticate"})
    }
    next()
}

module.exports = auth