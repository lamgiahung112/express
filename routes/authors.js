const express = require('express')
const Router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

Router.get('/', async (req, res) => {
   let searchOptions = {}
   if (req.query.name != null && req.query.name != ''){
      searchOptions.name = new RegExp(req.query.name, 'i')
   }
   const authors = await Author.find(searchOptions)
   try {
      res.render('authors/index', {
         authors: authors,
         searchOptions: req.query
      })
   } catch  {
      res.redirect('/')
   }
}) 

// New author route
Router.get('/new', (req, res) => {
   res.render('authors/new', {
      author: new Author()
   })
})

//Create new author
Router.post('/', async (req, res) => {
   let author = new Author({
      name: req.body.name
   })
   try {
      await author.save()
      res.redirect(`authors/${author._id}`)
   } catch {
      res.render('authors/new', {
         author: author,
         error: 'Error creating author'
      })
   }
})

Router.get('/:id', async (req, res) => {
   try {
      const author = await Author.findById(req.params.id)
      const books = await Book.find({author: author._id}).limit(6).exec()
      res.render('authors/show', {
         author: author,
         booksByAuthor: books
      })
   } catch {
      res.redirect('/')
   }
})

Router.get('/:id/edit', async (req, res) => {
   try {
      const author = await Author.findById(req.params.id)
      res.render('authors/edit', {
         author: author
      })
   } catch {
      res.redirect('/authors')
   }

})

Router.put('/:id', async (req, res) => {
   let author
   try {
      author  = await Author.findById(req.params.id)
      author.name = req.body.name
      await author.save()
      res.redirect(`/authors/${author._id}`)
   } catch {
      if (author == null) {
         res.redirect('/')
         return
      }
      res.render('authors/edit', {
         author: author,
         error: 'Error updating author'
      })
   }
})

Router.delete('/:id', async (req, res) => {
   let author
   try {
      author  = await Author.findById(req.params.id)
      await author.remove()
      res.redirect(`/authors`)
   } catch {
      if (author == null) {
         res.redirect('/')
         return
      }
      res.redirect(`/authors/${author._id}`)
   }
})
module.exports = Router
