import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const conversationSchema = new mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      unique: true
    }
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

conversationSchema.plugin(uniqueValidator)

conversationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)

export default Conversation
