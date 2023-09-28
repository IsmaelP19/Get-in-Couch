import Stat from '../../../models/stats'
import User from '../../../models/user'
import { errorHandler, createConnection } from '../../../utils/utils'

export default async function usersRouter (req, res) {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await createConnection()
      if (req.headers['x-origin'] !== 'getincouch.vercel.app') {
        return res.status(403).json({ error: 'forbidden' })
      }
    }

    if (req.method === 'POST') {
      const body = req.body

      if (!body.name) {
        return res.status(400).json({ error: 'name is required' })
      }

      if (!body.action) {
        return res.status(400).json({ error: 'action is required' })
      } else if (!['Roommate', 'Landlord', 'Tenant', 'All'].includes(body.action)) {
        return res.status(400).json({ error: 'action must be one of the following: Roommate, Landlord, Tenant' })
      }

      const stat = new Stat({
        name: body.name,
        action: body.action
      })

      const savedStat = await stat.save()

      res.status(201).json(savedStat)
    } else if (req.method === 'GET') {
      const author = req.query?.author // id of author
      const user = req.query?.user // id of user
      let stats

      if (author && user) {
        const authorObject = await User.findById(author)
        const userObject = await User.findById(user)

        if (!authorObject || !userObject) {
          return res.status(404).json({ error: 'author or user not found' })
        }

        const action = ['All']
        if (authorObject.isOwner) {
          if (!userObject.isOwner) {
            action.push('Tenant') // evaluating our tenants
          } else {
            console.log('entered here')
            return res.status(400).json({ error: 'author and user cannot both be landlords' })
          }
        } else if (userObject.isOwner) {
          action.push('Landlord') // evaluating our landlords
        } else {
          action.push('Roommate') // evaluating our roommates
        }

        stats = await Stat.find({ action: { $in: action } })
      } else {
        stats = await Stat.find({})
      }
      res.json(stats)
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
