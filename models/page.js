const mongoose = require('mongoose');

var PageSchema = mongoose.Schema ({

    title : {
        type: String,
        require: true
    },
    slug : {
        type: String,
    },
    content : {
        type: String,
        require: true
    },
    sorting : {
        type: number,
    }
})
 module.exports = mongoose.model('PageSchema', PageSchema)
 