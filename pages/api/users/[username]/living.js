import User from '../../../../models/user'
import Property from '../../../../models/property'
import { errorHandler, createConnection } from '../../../../utils/utils'

export default async function usersUsernameRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'GET') {
      const { username } = req.query
      if (username) {
        const user = await User.findOne({ username })
        if (user) {
          const livingProperty = await Property.findOne({ tenants: { $elemMatch: { user: user._id } } })
            .populate({ path: 'tenants.user', select: '_id username name surname profilePicture' })
            .populate({ path: 'owner', select: '_id username name surname profilePicture' }) // profilePicture still needed?

          if (livingProperty) {
            livingProperty.tenants.forEach(tenant => {
              const tenantId = tenant.user._id.toString()
              const tenantDate = livingProperty.tenants.find(t => t.user._id.toString() === tenantId).date
              tenant._doc.date = tenantDate
            })
          }

          return res.status(200).json(livingProperty ? { property: livingProperty } : { error: 'The user does not live in any property yet' })
        }
        return res.status(404).json({ error: 'user not found' })
      }
      return res.status(400).json({ error: 'username is required' })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
