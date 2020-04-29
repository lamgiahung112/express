require('dotenv').config()

const express = require('express')
const app = express()

debugger

//Requiring middlewares
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//Set up middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}))
app.use(methodOverride('_method'))

//Set up mongo
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (errors) => console.log(errors))
db.once('open', () => console.log('connected to mongodb'))

//Routes
const indexRoute = require('./routes/index')
const authorRoute = require('./routes/authors')
const bookRoute = require('./routes/books')
const apiAuthorRoute = require('./api/authors')

//setting view
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use('/', indexRoute)
app.use('/authors', authorRoute)
app.use('/books', bookRoute)
app.use('/api/authors', apiAuthorRoute)

app.listen(process.env.PORT || 9080, () => {
   console.log('listening port' + process.env.PORT)
})