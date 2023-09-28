import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const statSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  action: {
    type: String,
    enum: ['Roommate', 'Landlord', 'Tenant', 'All'],
    // las posibles formas de relacionarse con una propiedad: en roommate evaluaremos a los compañeros de piso,
    // en landlord a los caseros y en tenant a los inquilinos.
    // All es para cuando se evalúa a un usuario en general (comunicación y respeto)
    required: true
  }
})

statSchema.plugin(uniqueValidator)

statSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Stat = mongoose.models.Stat || mongoose.model('Stat', statSchema)

export default Stat
