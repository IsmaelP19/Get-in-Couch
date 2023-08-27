import User from '../../../models/user'
import Property from '../../../models/property'
import { errorHandler, createConnection, getCoordinatesFromAddress } from '../../../utils/utils'

export default async function propertiesRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'POST') {
      const body = req.body

      const owner = await User.findById(body.owner)

      if (!owner) {
        return res.status(400).json({ error: 'owner not found' })
      } else if (!owner.isOwner) {
        return res.status(400).json({ error: 'user provided is not an owner' })
      } else {
        try {
          const { street } = body
          const { city } = body
          const { country } = body
          const { town } = body || null
          const { images } = body || null

          const requiredFields = ['street', 'city', 'country', 'zipCode']
          const missingFields = requiredFields.reduce((acc, field) => {
            if (!body[field]) acc.push(field)
            return acc
          }, [])
          if (missingFields.length > 0) {
            const message = `${missingFields.join(', ')} ` + `${missingFields.length > 1 ? 'are' : 'is'} required`
            return res.status(400).json({ error: message })
          }
          let coordinates = { latitude: 0, longitude: 0 }

          if (process.env.NODE_ENV !== 'test') {
            if (town !== null) {
              coordinates = await getCoordinatesFromAddress(`${street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${body.zipCode}, ${town.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${country.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`)
            } else {
              coordinates = await getCoordinatesFromAddress(`${street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${body.zipCode}, ${city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}, ${country.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`)
            }
          }

          const property = new Property({
            title: body.title,
            description: body.description,
            price: body.price,
            location: {
              street,
              town,
              city,
              country,
              zipCode: body.zipCode,
              coordinates: [coordinates.latitude, coordinates.longitude]
            },
            features: {
              propertyType: body.propertyType,
              propertySize: body.propertySize,
              numberOfBathrooms: body.numberOfBathrooms,
              numberOfBedrooms: body.numberOfBedrooms,
              availableRooms: body.availableRooms,
              // isAvailable: body.isAvailable, //FIXME: NOT ON THE SCHEMA --> will be calculated on the frontend
              floor: body.floor || null,
              furniture: body.furniture,
              terrace: body.terrace || null,
              balcony: body.balcony || null,
              parking: body.parking,
              elevator: body.elevator || null,
              airConditioning: body.airConditioning,
              heating: body.heating,
              swimmingPool: body.swimmingPool || null,
              garden: body.garden || null,
              petsAllowed: body.petsAllowed || null,
              smokingAllowed: body.smokingAllowed || null
            },
            owner: body.owner,
            images
          })

          await property.save()

          owner.properties = owner.properties.concat(property._id)
          await owner.save()

          const jsonContent = { message: 'property succesfully created', id: property._id }
          if (process.env.NODE_ENV === 'test') {
            delete jsonContent.id
          }
          return res.status(200).json({ ...jsonContent })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      }
    } else if (req.method === 'GET') {
      const page = req.query?.page || 1 // default page is 1

      const search = req.query?.search
      const propertyType = req.query?.propertyType
      const minPrice = req.query?.minPrice
      const maxPrice = req.query?.maxPrice
      const rooms = req.query?.rooms
      const bathrooms = req.query?.bathrooms
      const state = req.query?.state
      const available = req.query?.available

      if (typeof parseInt(page) !== 'number') return res.status(400).json({ error: `Page must be a valid number (page is ${parseInt(1)})` })
      const limit = req.query?.limit || 8
      if (typeof parseInt(limit) !== 'number') return res.status(400).json({ error: 'Limit must be a valid number' })
      const skip = limit * (page - 1)

      let total
      let properties
      const sort = { publishDate: -1 }

      const filter = {}

      if (search) {
        const $regex = search
        const $options = 'i'
        filter.$or = [
          { title: { $regex, $options } },
          { 'location.town': { $regex, $options } },
          { 'location.city': { $regex, $options } },
          { 'location.zipCode': { $regex, $options } }
        ]
      }

      if (propertyType) {
        filter['features.propertyType'] = propertyType
      }

      if (minPrice) {
        filter.price = { $gte: parseInt(minPrice) }
      }

      if (maxPrice) {
        filter.price = { ...filter.price, $lte: parseInt(maxPrice) }
      }

      if (rooms) {
        filter['features.numberOfBedrooms'] = { $gte: parseInt(rooms) }
      }

      if (bathrooms) {
        filter['features.numberOfBathrooms'] = { $gte: parseInt(bathrooms) }
      }

      if (state) {
        filter['features.furniture'] = state // Cambiar 'state' por el campo correcto
      }

      if (available) {
        filter['features.availableRooms'] = { $gte: 1 }
      }

      try {
        properties = await Property.find(filter).sort(sort).skip(skip).limit(limit)
        total = await Property.countDocuments(filter)

        return res.status(200).json({ properties, message: properties.length === 0 ? 'no properties found' : 'properties succesfully retrieved', total })
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching properties.' })
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
