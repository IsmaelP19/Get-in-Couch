import Property from '../../../../models/property'
import User from '../../../../models/user'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function propertiesIdTenantsRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    const propertyId = req.query?.id
    const property = await Property.findById(propertyId)

    if (!property) {
      return res.status(404).json({ error: 'property not found' })
    } else if (property.owner.toString() !== req.headers.authorization) {
      return res.status(403).json({ error: 'forbidden' })
    }

    if (req.method === 'GET') {
      const tenants = await User.find({ _id: { $in: property.tenants } }).select('username name surname profilePicture')
      return res.status(200).json(tenants)
    } else if (req.method === 'PUT') {
      const { body } = req
      const oldTenants = property.tenants.map(t => t.toString())
      const newTenants = body.tenants
      console.log(oldTenants)
      console.log(newTenants)
      property.tenants = newTenants
      property.features.availableRooms = property.features.availableRooms - (newTenants.length - oldTenants.length)

      property.tenantsHistory = property.tenantsHistory.filter(t => newTenants.includes(t))

      const tenantsToRemove = oldTenants.filter(t => !newTenants.includes(t))
      property.tenantsHistory = [...property.tenantsHistory, ...tenantsToRemove]

      property.tenantsHistory = [...new Set(property.tenantsHistory)] // just in case

      if (property.availableRooms < 0) {
        return res.status(400).json({ error: `there are only ${property.numberOfBedrooms} rooms and ${property.tenants.length} tenants were added` })
      }
      await property.save()
      return res.status(200).json(property)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
