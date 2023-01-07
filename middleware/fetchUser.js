const jwt = require('jsonwebtoken');
const JWT_SECRET = "ashar.2day@karachi"
const { body, validationResult } = require('express-validator');

const fetchuser = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const token = req.header('auth-token')
        const data = jwt.verify(token, JWT_SECRET)
        if (!data) {
            return res.status(401).json({ error: "Unable to authenticate the user" })
        }
        req.user = data.user.id
        next()
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ error: "Some internal server error" })
    }
}

module.exports = fetchuser