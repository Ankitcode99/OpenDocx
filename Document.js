const mongoose = require('mongoose')

const DocsSchema = new mongoose.Schema({
    _id: String,
    data: Object
})

module.exports = mongoose.model('Document',DocsSchema)