const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ashar.2day@karachi"
const fetchuser = require('../middleware/fetchUser')

router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').exists(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let success = false
        const userWithEmail = await User.findOne({ email: req.body.email })
        if (userWithEmail) {
            return res.status(400).json({ error: "A user with this email already exists, Please enter another email!" })
        } else {
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({ success: success, authToken: authToken, userName: user.name })
        }

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some internal server error")
    }

})

router.post('/login', [
    body('email', 'please enter a valid email').isEmail(),
    body('password', 'please enter password').exists()
], async(req, res) => {
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(500).json({ error: "Please enter correct credentials" })
        }
        const passCheck = await bcrypt.compare(req.body.password, user.password)
        if (!passCheck) {
            return res.status(500).json({ error: "Please enter correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success: success, authToken: authToken, userName: user.name })

    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some internal server error occured" })
    }
})

router.post('/getuser', fetchuser, async(req, res) => {

    try {

        const userID = req.user
        const user = await User.findById(userID).select('-password')
        res.send(user)

    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some intenral server error occured!" })
    }
})



module.exports = router