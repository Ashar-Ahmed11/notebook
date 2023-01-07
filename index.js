const connectToMongo = require('./db')
connectToMongo()
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);


const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000



app.use(cors())

app.use(express.json())

//ROUTES::
// app.use('/api/auth', require('./routes/auth'))
// app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})