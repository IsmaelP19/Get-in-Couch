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

    if (req.method === 'GET') {
      const propertyId = req.query?.id
      const property = await Property.findById(propertyId)

      if (!property) {
        return res.status(404).json({ error: 'property not found' })
      } else if (property.owner.toString() !== req.headers.authorization) {
        return res.status(403).json({ error: 'forbidden' })
      } else {
        const tenants = await User.find({ _id: { $in: property.tenants } }).select('username name surname profilePicture')
        return res.status(200).json(tenants)
      }
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
