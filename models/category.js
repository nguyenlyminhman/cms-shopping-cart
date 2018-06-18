const mongoose = require('mongoose');

var Category = mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    }
}, { collection: 'Category' });

module.exports = mongoose.model('Category', Category)
