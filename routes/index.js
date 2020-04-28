const express = require('express')
const Router = express.Router()
const Book = require('../models/book')

Router.get('/', async (req, res) => { 
   try {
      let books = await Book.find().sort({createdAt: 'desc'}).limit(4).exec()
      console.log(books)
      res.render('index', {
         books: books
      })
   } catch {
      books = []
   }
   
}) 

module.exports = Router