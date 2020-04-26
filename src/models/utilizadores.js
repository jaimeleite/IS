const mongoose = require('mongoose')

var utilizadorSchema = new mongoose.Schema({
    orid: String,
    eids: [Number]
})

module.exports = mongoose.model('utilizadores', utilizadorSchema)