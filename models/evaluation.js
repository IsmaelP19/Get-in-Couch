import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const evaluationSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  stats: [{
    stat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stat',
      required: true
    },
    value: {
      type: Number,
      min: 0,
      max: 5,
      default: 3
    }
  }],
  lastEdit: {
    type: Date,
    default: Date.now
  }
})

evaluationSchema.plugin(uniqueValidator)

evaluationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Evaluation = mongoose.models.Evaluation || mongoose.model('Evaluation', evaluationSchema)

export default Evaluation
