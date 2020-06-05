const mongoose = require('mongoose')

var timeSchema = new mongoose.Schema({
    time: Date
})

module.exports = mongoose.model('times', timeSchema)