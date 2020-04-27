const express = require('express')
const Router = express.Router()
const Book = require('../models/book')

Router.get('/', async (req, res) => {
   let books 
   try {
      books = await Book.find().sort({createdAt: 'desc'}).limit(4).exec()
   } catch {
      books = []
   }
   res.render('index', {
      books: books
   })
}) 

module.exports = Router