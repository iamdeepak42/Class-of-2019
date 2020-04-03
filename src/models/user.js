
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema =  new Schema({
    name:{
        type: String,
        required: [true,'Pls provide your name']
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match:[
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            'Please provide a valid email'
        ]
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    status:{
        type: String,
        enum:['active','inactive'],
        default:'inactive'
    },
    password:{
        type: String,
        required: [true,'Please provide a password'],
        select: false
    },
    activeToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
},{
    timestamps: true
})

module.exports = mongoose.model('user', userSchema);
