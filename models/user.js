import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  surname: {
    type: String,
    required: true,
    minLength: 3
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  isOwner: {
    type: Boolean,
    required: true
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxLength: 240
  },
  profilePicture: {
    type: String
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }
  ],
  properties: [ // properties of the user (only owners have properties - tenants don't)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }
  ],
  ubication: {
    type: String,
    maxLength: 50
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }

})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
