require('dotenv').config()

const express = require('express')
const app = express()

//Requiring middlewares
const bodyParser = require('body-parser')


//Set up middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}))

//Set up mongo
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (errors) => console.log(errors))
db.once('open', () => console.log('connected to mongodb'))

//Routes
const indexRoute = require('./routes/index')
const authorRoute = require('./routes/authors')

//setting view
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use('/', indexRoute)
app.use('/authors', authorRoute)

app.listen(process.env.PORT || 9080, () => {
   console.log('listening port' + process.env.PORT)
})