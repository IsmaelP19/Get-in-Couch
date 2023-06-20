import Property from '../../../models/property'
import { errorHandler, createConnection, getCoordinatesFromAddress } from '../../../utils/utils'

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
      if (property && process.env.NODE_ENV === 'test') {
        property = property.toJSON()
      }

      property ? res.status(200).json(property) : res.status(404).json({ error: 'property not found' })
    } else if (req.method === 'DELETE') {
      const property = await Property.findById(id)
      if (property) {
        await Property.findByIdAndRemove(id)
        res.status(200).json({ message: 'property succesfully deleted' })
      } else {
        res.status(404).json({ error: 'property not found' })
      }
    } else if (req.method === 'PUT') {
      const property = await Property.findById(id)
      if (property) {
        const body = req.body
        try {
          let coordinates = property.location.coordinates
          const location = { // new location object (it contains the old location if none is provided)
            street: body.street?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || property.location.street,
            town: body.town?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || property.location.town || null,
            city: body.city?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || property.location.city,
            country: body.country?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || property.location.country,
            zipCode: body.zipCode || property.location.zipCode,
            coordinates
          }
          if (process.env.NODE_ENV !== 'test') { // to prevent use the API on tests
            if (property.location !== location) { // we only modify the coordinates if the location (street, city, country or zipCode) has changed
              if (location.town !== null) {
                coordinates = await getCoordinatesFromAddress(`${location.street}, ${location.zipCode}, ${location.town}, ${location.city}, ${location.country}`)
              } else {
                coordinates = await getCoordinatesFromAddress(`${location.street}, ${location.zipCode}, ${location.city}, ${location.country}`)
              }
              location.coordinates = [
                coordinates.latitude,
                coordinates.longitude
              ] // update the location object with the new coordinates
            }
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
              numberOfBedrooms: body.numberOfBedrooms || property.features.numberOfBedrooms,
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
            images: body.images || property.images || null
          }

          await Property.findByIdAndUpdate(id, propertyToUpdate)
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }

        res.status(201).json({ message: 'property succesfully updated' })
      } else {
        res.status(404).json({ error: 'property not found' })
      }
    }
    // TODO: add auth, only the owner of the property can delete it or update it
  } catch (error) {
    errorHandler(error, req, res)
  }
}
