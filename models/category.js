const mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({

    name : {
        type: String,
        require: true
    },
    slug : {
        type: String,
    }
},{CategorySchema});

module.exports = mongoose.model('CategorySchema', CategorySchema)
