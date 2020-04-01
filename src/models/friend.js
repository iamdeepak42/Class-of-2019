const mongoose = require('mongoose')
const validator = require('validator')

const friendSchema = new mongoose.Schema({
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
    pictureLeft:{
        type: Buffer
    },
    pictureRight:{
        type: Buffer
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

friendSchema.methods.toJSON = function () {
    const friend = this
    const friendObject = friend.toObject();
    
    delete friendObject.picture
    return friendObject
}

const Friend = mongoose.model('Friend', friendSchema)

module.exports = Friend
