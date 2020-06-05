const mongoose = require('mongoose')

/*var pubSchema = new mongoose.Schema({
    _id: String,
    authors: [String],
    title: String,
    journal: String,
    volume: String,
    issn: String,
    date: String,
    //doi: coredata -> prism:doi ?	(existe ?)
    doi: String,
    cites: String,
    //type: coredata -> subtypeDescription (ou prism:aggregationType?)
    type: String,
    //location: ?
})

var userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    biography: String,
    eids: [String],
    publicacoes: [pubSchema],
})*/

var timeSchema = new mongoose.Schema({
    time: Date
})

module.exports = mongoose.model('times', timeSchema)