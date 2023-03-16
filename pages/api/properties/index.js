import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

async function getCoordinatesFromAddress (address) {
  const API_KEY = process.env.POSITIONSTACK_API_KEY
  const url = `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${address}&limit=1`
  const response = await fetch(url)
  const data = await response.json()
  const latitude = data.data[0].latitude
  const longitude = data.data[0].longitude
  return { latitude, longitude }
}

export default async function propertiesRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

    if (req.method === 'POST') {
      const body = req.body

      try {
        let { street } = body
        let { city } = body
        let { country } = body
        let { town } = body || null
        const { images } = body || null

        const requiredFields = ['street', 'city', 'country', 'zipCode']
        const missingFields = requiredFields.reduce((acc, field) => {
          if (!body[field]) acc.push(field)
          return acc
        }, [])
        if (missingFields.length > 0) {
          const message = `${missingFields.join(', ')} ` + `${missingFields.length > 1 ? 'are' : 'is'} required`
          return res.status(400).json({ error: message })
        } else {
          street = street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          country = country.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        }

        let coordinates = { latitude: 0, longitude: 0 }

        if (process.env.NODE_ENV !== 'test') {
          if (town !== null) {
            town = town.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            coordinates = await getCoordinatesFromAddress(`${street}, ${body.zipCode}, ${town}, ${city}, ${country}`)
          } else {
            coordinates = await getCoordinatesFromAddress(`${street}, ${body.zipCode}, ${city}, ${country}`)
          }
        }

        // convert images to base64 format so we can store them in the database

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
            isAvailable: body.isAvailable,
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
        const jsonContent = { message: 'property succesfully created', id: property._id }
        if (process.env.NODE_ENV === 'test') {
          delete jsonContent.id
        }
        return res.status(201).json({ ...jsonContent })
      } catch (error) {
        return res.status(400).json({ error: error.message })
      }
    } else if (req.method === 'GET') {
      let properties = await Property.find({})
      if (process.env.NODE_ENV === 'test') {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        properties = properties.map(property => property.toJSON())
      }

      const page = req.query.page ? parseInt(req.query.page) : 1 // default page is 1
      const startIndex = (page - 1) * 10
      const endIndex = startIndex + 10
      const propertiesToReturn = properties.slice(startIndex, endIndex)

      // if there are no properties to return, redirect to 404
      if (propertiesToReturn.length === 0) {
        return res.status(404).json({ message: 'no properties found', total: properties.length })
      }
      return res.status(200).json({ properties: propertiesToReturn, message: 'properties succesfully retrieved', total: properties.length })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
