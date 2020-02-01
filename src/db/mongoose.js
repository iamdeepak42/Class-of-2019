const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/class-of-2019',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})




