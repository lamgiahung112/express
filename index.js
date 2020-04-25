require('dotenv').config()

const express = require('express')
const app = express()

//Set up mongo
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (errors) => console.log(errors))
db.once('open', () => console.log('connected to mongodb'))

const indexRoute = require('./routes/index')

//setting view
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use('/', indexRoute)

app.listen(process.env.PORT || 9080)