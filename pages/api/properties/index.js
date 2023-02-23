import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function propertiesRouter (req, res) {
  try {
    process.env.NODE_ENV !== 'test' && await createConnection()

    if (req.method === 'POST') {
      const body = req.body

      try {
        const property = new Property({
          title: body.title,
          description: body.description,
          price: body.price,
          location: {
            street: body.street,
            city: body.city,
            country: body.country,
            zipCode: body.zipCode,
            coordinates: body.coordinates
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
          images: body.images
        })

        await property.save()
        res.status(201).json({ message: 'property succesfully created' })
      } catch (error) {
        errorHandler(error, req, res)
      }
    } else if (req.method === 'GET') {
      let properties
      if (process.env.NODE_ENV === 'test') {
        // passwordHash is removed with the transform function of the model
        // but it is still returned in the response of the mock on tests
        properties = await (await Property.find({})).map(property => property.toJSON())
      } else {
        properties = await Property.find({})
      }
      res.status(200).json(properties)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
