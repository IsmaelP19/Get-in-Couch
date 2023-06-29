import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 3
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  images: [
    {
      type: String
    }
  ],
  publishDate: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]

})

commentSchema.plugin(uniqueValidator)

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment
