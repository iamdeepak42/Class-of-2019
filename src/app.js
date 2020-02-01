const path = require('path')
const express = require('express')
const hbs = require('hbs')
require('./db/mongoose')

const friendRouter = require('./routers/friend')
const port = process.env.port || 3000


const app = express()
app.use(express.json())

app.use(friendRouter)


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../')
const viewsPath = path.join(__dirname, '../public/hbs')
const partialsPath = path.join(__dirname, '../public/hbs/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('friends', {
   
    })
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