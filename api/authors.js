const express = require('express')
const Router = express.Router()
const Author = require('../models/author')


//Get all authors
Router.get('/', async (req, res) => {
   try {
      const authors = await Author.find()
      res.json(authors)
   } catch (err) {
      res.status(500).json({message: err.message})
   }
})


//Get 1 authors
Router.get('/:id', getAuthor, (req, res) => {
   res.json(res.author)
})


//Creating 1 book
Router.post('/', async (req, res) => {
   const author = new Author({
      name: req.body.name
   })
   try {
      const newAuthor = await author.save()
      res.status(201).json(newAuthor)
   } catch (err) {
      res.status(400).json({message: err.message})
   }
})


//Updating 1 book
Router.patch('/:id', getAuthor, async (req, res) => {
   if (req.body.name != null) {
      res.author.name = req.body.name
   }
   try {
      const updatedAuthor = await res.author.save()
      res.json(updatedAuthor)
   } catch (error) {
      res.status(400).json({message: error.message})
   }
})


//Deleting 1 book
Router.delete('/:id', getAuthor, async (req, res) => {
   try {
      await res.author.remove()
      res.json({message: 'Deleted author'})
   } catch (error) {
      res.status(500).json({message: error.message})
   }
})

async function getAuthor(req, res, next) {
   let author
   try {
      author = await Author.findById(req.params.id)
      if (author == null) {
         return res.status(404).json({message: 'Cannot find'})
      }
   } catch (err) {
      return res.status(500).json({message: err.message})
   }
   res.author = author 
   next()
}

module.exports = Router