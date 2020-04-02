const path = require('path')
const express = require('express')
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const authenticate = require('./middlewares/authenticate')

dotenv.config({
    path: path.join(__dirname,'/config/config.env') 
})

require('./db/mongoose');

const Friend = require('./models/friend');

const friendRouter = require('./routers/friend');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());




// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../')
const viewsPath = path.join(__dirname, '../public/views')
app.set('view engine', 'ejs')

// app.engine('ejs', ejs({
//     extname: 'ejs', 
//     defaultLayout: 'layout', 
//     layoutsDir: viewsPath + '/layouts',
//     partialsDir: viewsPath + '/partials'
// }))

// Setup handlebars engine and views location
app.set('views', viewsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(expressLayouts)
app.set('layout', 'layouts/layout');


app.use(friendRouter)

app.get('/', async (req, res) => {
    try{
        const friends = await Friend.find({})
        res.render('friends', {
            friends
        })
    }catch(e){
        res.status(500).send(e)
    }
    
})

app.get('/form',authenticate, (req, res) => {
    const user = req.loggedInUser;
    res.render('form', {
        user
    })
})

app.get('/form2', (req, res) => {
    res.render('form2', {
        
    })
})

app.get('/login',(req,res,next)=>{
    res.render('login',{
        errMsg:null
    });
})

app.get('/register',(req,res,next)=>{
    res.render('register',{
        errMsg:null,
        success:null
    });
})

app.get('/forgot-password',(req,res,next)=>{
    res.render('forgotPassword',{
        msg: null
    });
})

app.use(require('./routers/auth'));


app.use((req, res) => {
    res.render('404', {
        path: req.url
    })
})

app.use((error,req,res,next)=>{
    res.status(400).render('error',{
        msg: error
    })
})


const port = process.env.PORT || 3000;
app.listen(port,function(err,done){
    if(err){
        console.log(err)
    }else{
        console.log("server is up on port", port); 
    }
})