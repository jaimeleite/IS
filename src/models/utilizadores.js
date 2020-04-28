const mongoose = require('mongoose')

var utilizadorSchema = new mongoose.Schema({
    _id: String,
    eids: [Number]
})

module.exports = mongoose.model('utilizadores', utilizadorSchema)