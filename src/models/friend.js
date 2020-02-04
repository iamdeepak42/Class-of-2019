const mongoose = require('mongoose')


const Friend = mongoose.model('Friend',{
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname:{
        type: String,
        trim: true,
        required: true
    },
    stand:{
        type: String,
        trim: true,
        required: true
    }
})

module.exports = Friend
