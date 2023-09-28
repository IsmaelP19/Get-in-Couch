import User from '../../../models/user'
import Property from '../../../models/property'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function propertiesRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    const userId = req.headers.authorization
    const userObject = await User.findById(userId)
    if (!userObject) {
      return res.status(404).json({ error: 'user not found' })
    } else if (!userObject.isOwner) {
      return res.status(403).json({ error: 'current user is not an owner' })
    }

    if (req.method === 'GET') {
      const page = req.query?.page || 1 // default page is 1

      const cond = req.query?.cond

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

      const filter = {
        isActive: true,
        owner: userId
      }

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
        if (cond) {
          properties = await Property.find({ owner: userId }).sort(sort).populate('tenants.user', '_id username name surname profilePicture')

          // if (properties) {
          //   properties.forEach(property => {
          //     property.tenants.forEach(tenant => {
          //       const tenantId = tenant.user._id.toString()
          //       const tenantDate = property.tenants.find(t => t.user._id.toString() === tenantId).date
          //       tenant._doc.date = tenantDate
          //     })
          //   })
          // }

          return res.status(200).json({ properties, message: properties.length === 0 ? 'no properties found' : 'properties succesfully retrieved' })
        }

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
