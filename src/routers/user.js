const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try {
    //     // const users = await User.find({})
    //     res.send(req.user)
    // } catch {
    //     res.status(500).send()
    // }
})

// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
        
//         if (!user) {
//             res.status(404).send("User " + _id + " not found")
//         }
        
//         res.send(user)
//     } catch {
//         res.status(500).send()
//     }
// })

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})      
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validFields = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => validFields.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }
    
    try {
        // const user = await User.findById(req.params.id) 
        
        updates.forEach((update) => req.user[update] = req.body[update])
        console.log(req.user)
        await req.user.save()
         // const user = await User.findByIdAndUpdate( req.params.id , req.body, { new: true, runValidators: true })

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        // const user = await User.findByIdAndDelete({ _id: req.params.id})

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer(
    { 
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image file'))
            }

            cb(undefined, true)
        }
    })
router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {
    req.user.avatar = req.file.buffer
    req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, (req, res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

module.exports = router