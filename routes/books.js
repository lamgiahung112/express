const express = require('express')
const Router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// domain.com/books
Router.get('/', async (req, res) => {
   let query = Book.find()
   if (req.query.title != null && req.query.title != ''){
      query = query.regex('title', RegExp(req.query.title, 'i'))
   }
   if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
      query = query.lte('publishDate', req.query.publishedBefore)
   }
   if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
      query = query.gte('publishDate', req.query.publishedAfter)
   }
   try {
      const books = await query.exec()
      res.render('books/index', {
         books: books,
         searchOptions: req.query
      })
   } catch {
      res.redirect('/')
   }
}) 

// New book route
Router.get('/new', async (req, res) => {
   renderFormPage(res, new Book(), 'new')
})

//Create new book
Router.post('/', async (req, res) => {
   const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
   })
   saveCover(book, req.body.cover)
   try {  
      const newBook = await book.save()
      res.redirect(`books/${newBook._id}`)
   } catch  {
      renderFormPage(res, book, 'new', true)
   }
})

// View book
Router.get('/:id', async (req, res) => {
   try {
      const book = await Book.findById(req.params.id)
                              .populate('author').exec()
      res.render('books/show', {
         book: book
      })
   } catch {
      res.redirect('/')
   }
})

// Edit book
Router.get('/:id/edit', async (req, res) => {
   try {
      const book = await Book.findById(req.params.id)
      renderFormPage(res, book, 'edit')
   } catch {
      res.redirect('/')
   }
})

// Edit book (PUT)
Router.put('/:id', async (req, res) => {
   let book 
   try {  
      book = await Book.findById(req.params.id)
      book.title = req.body.title
      book.author = req.body.author
      book.publishDate = new Date(req.body.publishDate)
      book.pageCount = req.body.pageCount
      book.description = req.body.description
      if (req.body.cover != null && req.body.cover != '') {
         saveCover(book, req.body.cover)
      }
      await book.save()
      res.redirect(`/books/${book._id}`)
   } catch  {
      if (book != null)
      renderFormPage(res, book, 'new', true)
      else res.redirect('/')
   }
})

//Delete book
Router.delete('/:id', async (req, res) => {
   let book
   try {
      book = await Book.findById(req.params.id)
      await book.remove()
      res.redirect('/books')
   } catch {
      if (book != null) {
       res.render('books/show', {
          book: book,
          err: 'Error deleting book'
       }) 
      }  else res.redirect('/')
   }
})

async function renderFormPage(res, book, form, hasError = false) {
   try {
      const authors = await Author.find()
      let params = {
         authors: authors,
         book: book
      }
      if (hasError == true){
         if (form == 'edit'){
            params.error = 'Error updating book'
         }
         else {
            params.error = 'Error creating book'
         }
      }
      res.render(`books/${form}`, params)
   } catch  {
      res.send('error')
   }
}


function saveCover(book, coverEncoded) {
   if (coverEncoded == null) return 
   const cover = JSON.parse(coverEncoded)
   if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
   }
}
module.exports = Router