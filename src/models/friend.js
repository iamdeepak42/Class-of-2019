const mongoose = require('mongoose')
const validator = require('validator')

const Friend = mongoose.model('Friend',{
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    birthday:{
        type: Date,
        trim: true,
        required: true
    },
    gender:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        email:true,
        lowercase: true,
        validate(val){
            if (!validator.isEmail(val))
                throw new Error('Email is invalid')
        },
        unique: true
    },
    tale: {
        type: String,
        trim: true,
        required: true
    },
    picture:{
        type: Buffer
    }
})

module.exports = Friend
