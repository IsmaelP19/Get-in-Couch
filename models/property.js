import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3
  },
  description: { // the description the owner enters when creating the property
    type: String,
    required: true,
    minLength: 3
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    street: {
      type: String,
      required: true
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
    coordinates: { // [longitude, latitude], for the map section
      type: [Number],
      unique: true
      // non required for now, maybe we can add it with the geolocation API from Google Maps or even the browser
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
      required: true
    },
    numberOfBathrooms: {
      type: Number,
      required: true
    },
    numberOfBedrooms: {
      type: Number,
      required: true
    },
    // isAvailable: {
    //   type: Boolean,
    //   required: true
    // },
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

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [
    {
      type: Buffer
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
  ],
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment'
  //   }
  // ],
  views: {
    type: Number,
    default: 0
  },
  tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
  // isFullyRented: { // maybe this is not necessary, we can check if the tenants array is empty or not
  //   // we can use this to show if the property is at full capacity or not
  //   type: Boolean,
  //   default: false
  // }

})

propertySchema.index({ 'location.coordinates': '2dsphere' })

propertySchema.index({ 'location.street': 1, 'location.city': 1, 'location.country': 1, 'location.zipCode': 1, 'location.coordinates': 1 }, { unique: true }) // not sure if this is the correct way to do it

propertySchema.plugin(uniqueValidator)

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.location.coordinates
  }
})

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema)

export default Property
