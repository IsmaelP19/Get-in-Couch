import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    maxLength: 1024
  },
  author: { // transmitter
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
})

messageSchema.plugin(uniqueValidator)

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message
