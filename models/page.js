const mongoose = require('mongoose');

var Page = mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
        require: true
    },
    sorting: {
        type: Number
    }
}, { collection: 'Page' })
module.exports = mongoose.model('Page', Page)
