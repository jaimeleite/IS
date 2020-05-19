const mongoose = require('mongoose')

var orcidSchema = new mongoose.Schema({
    _id: String
})

module.exports = mongoose.model('orcids', orcidSchema)