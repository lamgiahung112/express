const express = require('express')
const Router = express.Router()
const Author = require('../models/author')

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
      const newAuthor = await author.save()
      //res.redirect(`authors/${author._id}`)
      res.redirect('/authors')
   } catch {
      res.render('authors/new', {
         author: author,
         error: 'Error creating author'
      })
   }
})
module.exports = Router