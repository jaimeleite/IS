const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    _id: String,
    eids: [Number]
})

module.exports = mongoose.model('users', userSchema)