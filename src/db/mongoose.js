const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((db)=>{
    console.log('db connection success');
}).catch((err)=>{
    console.log(err);
})




