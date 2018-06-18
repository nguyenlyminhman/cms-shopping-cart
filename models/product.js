const mongoose = require('mongoose');

var Product = mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
    desc: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String
    }
}, { collection: 'Product' })
module.exports = mongoose.model('Product', Product)
