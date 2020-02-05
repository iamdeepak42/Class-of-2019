const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')
require('./db/mongoose')

const Friend = require('./models/friend')

const friendRouter = require('./routers/friend')
const port = process.env.port || 3000


const app = express()
app.use(express.json())

app.use(friendRouter)


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../')
const viewsPath = path.join(__dirname, '../public/views')
app.set('view engine', 'hbs')

app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: viewsPath + '/layouts',
    partialsDir: viewsPath + '/partials'
}))

// Setup handlebars engine and views location
app.set('views', viewsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', async (req, res) => {
    try{
        const friends = await Friend.find({})
        debugger;
        res.render('friends', {
            friends
        })
    }catch(e){
        res.status(500).send(e)
    }
    
})

app.get('/form', (req, res) => {
    res.render('form', {
   
    })
})



app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port', port)
})