const path = require('path')
const express = require('express')
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')

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

app.get('', async (req, res) => {
    try{
        const friends = await Friend.find({})
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

app.get('/form2', (req, res) => {
    res.render('form2', {
   
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