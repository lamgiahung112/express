const mongoose = require('mongoose')
const path = require('path')

const coverImagePath = 'uploads/bookCovers'

let bookSchema = mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String
   },
   publishDate: {
      type: Date,
      required: true
   },
   pageCount: {
      type: Number,
      required: true
   },
   CreatedAt: {
      type: Date,
      required: true,
      default: Date.now
   },
   coverImageName: {
      type: String,
      required: true
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Author'
   }
})

bookSchema.virtual('coverImagePath').get(function() {
   if (this.coverImageName != null){
      return path.join('/', coverImagePath, this.coverImageName)
   }
})

module.exports = mongoose.model('Book', bookSchema, 'Books')
module.exports.coverImagePath = coverImagePath