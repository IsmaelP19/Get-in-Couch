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
          // the filter should be { tenantsHistory: { $elemMatch: { user: user._id } } } and those property with isActive = true
          const filter = {
            tenantsHistory: {
              $elemMatch: {
                user: user._id
              }
            },
            isActive: true
          }
          const propertyHistory = await Property.find(filter)

          return res.status(200).json(propertyHistory ? { properties: propertyHistory } : { error: 'The user has not lived in any property yet' })
        }
        return res.status(404).json({ error: 'user not found' })
      }
      return res.status(400).json({ error: 'username is required' })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
