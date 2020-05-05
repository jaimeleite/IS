const mongoose = require('mongoose')

var pubSchema = new mongoose.Schema({
    _id: String,
    authors: [String],
    title: String,
    journal: String,
    volume: String,
    issn: String,
    date: String,
    doi: String,
    cites: String,
    type: String,
})

var userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    biography: String,
    eids: [String],
    publicacoes: [pubSchema]
})

module.exports = mongoose.model('users', userSchema)