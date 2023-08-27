import Property from '../../../../models/property'
import User from '../../../../models/user'
import { errorHandler, createConnection, getCoordinatesFromAddress } from '../../../../utils/utils'

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } }
export default async function propertiesIdRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    const id = req.query.id

    if (req.method === 'GET') {
      let property = await Property.findById(id)

      if (property && process.env.NODE_ENV !== 'test') {
        property = await property.populate('owner', 'username name surname')
      }

      if (property && process.env.NODE_ENV === 'test') {
        property = property.toJSON()
      }

      property ? res.status(200).json(property) : res.status(404).json({ error: 'property not found' })
    } else if (req.method === 'DELETE') {
      // FIXME: add loggedUser on req.body on the frontend

      const property = await Property.findById(id)
      const loggedUser = await User.findById(req.body.loggedUser)
      if (!loggedUser) {
        return res.status(400).json({ error: 'logged user not found' })
      }
      if (property) {
        const owner = await User.findById(property.owner)
        if (owner.id !== loggedUser.id) {
          return res.status(403).json({ error: 'you don\'t have enough permissions to delete the given property' })
        }
        owner.properties = owner.properties.filter(property => property.toString() !== id.toString())
        await owner.save()
        await Property.findByIdAndRemove(id)
        res.status(204).json({ message: 'property succesfully deleted' })
      } else {
        res.status(404).json({ error: 'property not found' })
      }
    } else if (req.method === 'PUT') {
      const property = await Property.findById(id)
      if (property) {
        const body = req.body
        // FIXME: add loggedUser on req.body on the frontend

        const loggedUser = await User.findById(body?.loggedUser)
        if (!loggedUser) {
          return res.status(400).json({ error: 'logged user not found' })
        } else if (loggedUser.id !== property.owner.toString()) {
          return res.status(403).json({ error: 'you don\'t have enough permissions to update the given property' })
        }
        try {
          let coordinates = property.location.coordinates
          const location = { // new location object (it contains the old location if none is provided)
            street: body?.street || property.location.street,
            town: body?.town || property.location.town || null,
            city: body?.city || property.location.city,
            country: body?.country || property.location.country,
            zipCode: body.zipCode || property.location.zipCode,
            coordinates
          }
          if (process.env.NODE_ENV !== 'test') { // to prevent use the API on tests
            if (JSON.stringify(property.location) !== JSON.stringify(location)) { // we only modify the coordinates if the location (street, city, country or zipCode) has changed
              if (location.town !== null) {
                coordinates = await getCoordinatesFromAddress(`${location.street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${location.zipCode}, ${location.town.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${location.city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${location.country.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`)
              } else {
                coordinates = await getCoordinatesFromAddress(`${location.street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${location.zipCode}, ${location.city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${location.country.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`)
              }
              location.coordinates = [
                coordinates.latitude,
                coordinates.longitude
              ]
            }
          }

          const { numberOfBedrooms, availableRooms } = body
          const tenants = property.tenants
          if (availableRooms > numberOfBedrooms - tenants.length) {
            return res.status(400).json({ error: 'Entered more available rooms than actual space available (bedrooms - tenants)' })
          }

          const propertyToUpdate = { // if nothing has changed, the old value is kept
            title: body.title || property.title,
            description: body.description || property.description,
            price: body.price || property.price,
            location, // it contains the old location if none is provided
            features: {
              propertyType: body.propertyType || property.features.propertyType,
              propertySize: body.propertySize || property.features.propertySize,
              numberOfBathrooms: body.numberOfBathrooms || property.features.numberOfBathrooms,
              numberOfBedrooms: numberOfBedrooms || property.features.numberOfBedrooms,
              availableRooms, // if we write || property.features.availableRooms, it will keep the old value when the new value is 0
              floor: body.floor || property.features.floor || null,
              furniture: body.furniture || property.features.furniture,
              terrace: body.terrace || property.features.terrace || null,
              balcony: body.balcony || property.features.balcony || null,
              parking: body.parking || property.features.parking,
              elevator: body.elevator || property.features.elevator || null,
              airConditioning: body.airConditioning || property.features.airConditioning,
              heating: body.heating || property.features.heating,
              swimmingPool: body.swimmingPool || property.features.swimmingPool || null,
              garden: body.garden || property.features.garden || null,
              petsAllowed: body.petsAllowed || property.features.petsAllowed || null,
              smokingAllowed: body.smokingAllowed || property.features.smokingAllowed || null
            },
            lastEdited: Date.now(),
            images: body.images || property.images || null,
            tenants: body.tenants || property.tenants || null
          }

          await Property.findByIdAndUpdate(id, propertyToUpdate)

          res.status(201).json({ message: 'property succesfully updated', id: property.id })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      } else {
        res.status(404).json({ error: 'property not found' })
      }
    }
    // TODO: add auth, only the owner of the property can delete it or update it
  } catch (error) {
    console.log(JSON.stringify(error))
    errorHandler(error, req, res)
  }
}
