const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://asharahmed:ILOVEcars123@cluster0.qolymsk.mongodb.net/cloudbook"


const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("CONNECTED TO MONGO SUCCESSFULLY")
    })
}

module.exports = connectToMongo