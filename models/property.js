import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  description: { // the description the owner enters when creating the property
    type: String,
    required: true,
    minLength: 3,
    maxLength: 2048
  },
  price: {
    type: Number,
    // must be positive
    min: 0,
    required: true
  },
  location: {
    street: {
      type: String,
      required: true
    },
    town: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: { // [latitude, longitude], for the map section
      type: [Number]
      // sparse: true,
      // validate: {
      //   validator: function (value) {
      //     if (!value) return true // we don't want to validate if the coordinates are not provided
      //     if (value.length !== 2) return false
      //     const [lat, lon] = value
      //     if (typeof lat !== 'number' || typeof lon !== 'number') return false
      //     if (lat < -90 || lat > 90) return false // latitud fuera de rango
      //     if (lon < -180 || lon > 180) return false // longitud fuera de rango
      //     return true
      //   },
      //   message: props => 'must be a valid coordinates array [latitude, longitude]'
      // }

    }

  },
  features: {
    propertyType: {
      type: String,
      // now we add the enum property with an array of possible values for the propertyType
      enum: ['Apartamento', 'Casa', 'Villa', 'Estudio'],
      required: true,
      minLength: 3
    },
    propertySize: { // in square meters
      type: Number,
      min: 1,
      required: true
    },
    numberOfBathrooms: {
      type: Number,
      min: 1,
      required: true
    },
    numberOfBedrooms: {
      type: Number,
      min: 1, // even a studio has at least one bedroom (the living room and all the rest)
      required: true
    },

    floor: {
      type: Number
    },
    furniture: {
      type: String,
      enum: ['Amueblado', 'Semi-amueblado', 'Sin muebles'],
      required: true
    },
    terrace: {
      type: Boolean
    },
    balcony: {
      type: Boolean
    },
    parking: {
      type: String,
      enum: ['Garaje', 'Parking', 'Sin parking'],
      required: true
    },
    elevator: {
      type: Boolean
    },
    airConditioning: {
      type: Boolean,
      required: true
    },
    heating: {
      type: Boolean,
      required: true
    },
    swimmingPool: {
      type: Boolean
    },
    garden: {
      type: Boolean
    },
    petsAllowed: {
      type: Boolean
    },
    smokingAllowed: {
      type: Boolean
    }

  },

  owner: { // we cannot create a property without an owner
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  lastEdited: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tenantsHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

// propertySchema.index({ 'location.coordinates': '2dsphere' }) // to be able to search by geo location
propertySchema.index({ 'location.street': 1, 'location.city': 1, 'location.country': 1, 'location.zipCode': 1 }, { unique: true }) // not sure if this is the correct way to do it

// the coordinates are ESTIMATE, so they are not unique, we cannot check if the complete address is unique because of data privacy (we don't want to store the exact address of the property)

propertySchema.plugin(uniqueValidator)

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema)

export default Property
